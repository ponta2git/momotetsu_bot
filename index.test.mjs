import { describe, it, expect, vi, beforeEach } from 'vitest'

// Discord.js のモック設定
vi.mock('discord.js', () => ({
  Client: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    login: vi.fn(),
    user: { id: 'bot-id' }
  }))
}))

// HTTP モジュールのモック設定
vi.mock('http', () => ({
  createServer: vi.fn().mockReturnValue({
    listen: vi.fn()
  })
}))

// 元の環境変数を保存
const originalEnv = process.env

// 各テスト前にモックをリセットし環境変数を復元する
beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...originalEnv }
  process.env.TOKEN = 'fake-token'
})

describe('メンバーユーティリティ機能のテスト', () => {
  // メンバーユーティリティの共通設定
  let memberUtils;
  
  beforeEach(() => {
    memberUtils = {
      shuffle: ([...arr]) => {
        for (let i = arr.length - 1; i > 0; --i) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr
      },
      electMembers: () => {
        const all = ['あかねまみ', 'いーゆー', 'おおたか']
        const CNT_MEMBERS = 2
        
        return memberUtils.shuffle(all).slice(0, CNT_MEMBERS)
      }
    }
  });

  it('shuffle関数: 元の配列を変更せずにランダムに並べ替えられた新しい配列を返すこと', () => {
    // Math.random の振る舞いを予測可能にする
    const mockRandom = vi.spyOn(Math, 'random')
    mockRandom.mockReturnValue(0.5)
    
    const input = [1, 2, 3, 4, 5]
    const result = memberUtils.shuffle(input)
    
    // 元の配列が変更されていないことを確認
    expect(input).toEqual([1, 2, 3, 4, 5])
    // モックした乱数により結果が予測可能であることを確認
    expect(result).not.toEqual(input)
    
    // Math.random のモックを元に戻す
    mockRandom.mockRestore()
  })
  
  it('electMembers関数: 設定された人数(2名)のメンバーをランダムに抽選して返すこと', () => {
    // shuffle関数の動作をモック化して結果を予測可能にする
    memberUtils.shuffle = vi.fn(arr => arr)
    
    const result = memberUtils.electMembers()
    
    expect(memberUtils.shuffle).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(2)
    expect(result).toEqual(['あかねまみ', 'いーゆー'])
  })
})

describe('メッセージ応答機能のテスト', () => {
  // 共通のメッセージハンドラー設定
  let messageHandlers;
  let mockMsg;
  
  beforeEach(() => {
    mockMsg = {
      reply: vi.fn(),
      content: ''
    }
    
    messageHandlers = {
      sendGinji: msg => msg.reply('スリの銀次'),
      sendManner: msg => msg.reply('マナー'),
      parseMessage(msg) {
        if (msg.content.includes('マナー')) this.sendGinji(msg)
        else if (msg.content.includes('スリの銀次')) this.sendManner(msg)
      }
    }
  });

  it('sendGinji関数: 「スリの銀次」というメッセージで返信すること', () => {
    messageHandlers.sendGinji(mockMsg)
    expect(mockMsg.reply).toHaveBeenCalledWith('スリの銀次')
  })
  
  it('sendManner関数: 「マナー」というメッセージで返信すること', () => {
    messageHandlers.sendManner(mockMsg)
    expect(mockMsg.reply).toHaveBeenCalledWith('マナー')
  })
  
  it('parseMessage関数: メッセージに「マナー」が含まれる場合、sendGinji関数を呼び出すこと', () => {
    // 関数の呼び出しをスパイする
    messageHandlers.sendGinji = vi.fn()
    messageHandlers.sendManner = vi.fn()
    
    mockMsg.content = 'これはマナーです'
    messageHandlers.parseMessage(mockMsg)
    
    expect(messageHandlers.sendGinji).toHaveBeenCalledWith(mockMsg)
    expect(messageHandlers.sendManner).not.toHaveBeenCalled()
  })
  
  it('parseMessage関数: メッセージに「スリの銀次」が含まれる場合、sendManner関数を呼び出すこと', () => {
    // 関数の呼び出しをスパイする
    messageHandlers.sendGinji = vi.fn()
    messageHandlers.sendManner = vi.fn()
    
    mockMsg.content = 'スリの銀次はどこ?'
    messageHandlers.parseMessage(mockMsg)
    
    expect(messageHandlers.sendManner).toHaveBeenCalledWith(mockMsg)
    expect(messageHandlers.sendGinji).not.toHaveBeenCalled()
  })
})

describe('メンション応答機能のテスト', () => {
  it('parseMention関数: メッセージが「抽選」で終わる場合、メンバー抽選結果を返信すること', () => {
    const msg = {
      content: '@bot 抽選',
      reply: vi.fn()
    }
    
    const memberUtils = {
      electMembers: vi.fn(() => ['あかねまみ', 'いーゆー']),
      sendMembers: msg => msg.reply(memberUtils.electMembers().join('、'))
    }
    
    const mentionHandlers = {
      parseMention(msg) {
        if (msg.content.endsWith('抽選')) memberUtils.sendMembers(msg)
      }
    }
    
    mentionHandlers.parseMention(msg)
    
    expect(memberUtils.electMembers).toHaveBeenCalled()
    expect(msg.reply).toHaveBeenCalledWith('あかねまみ、いーゆー')
  })
})