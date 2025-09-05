import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Bot,
  User,
  Trash2,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { difyApiService } from '../services/difyApi';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 预设的快捷问题
  const quickQuestions = [
    {
      id: 1,
      text: "创建一个高优先级的用户登录功能任务",
      icon: CheckCircle,
      category: "任务管理"
    },
    {
      id: 2,
      text: "显示当前所有进行中的任务",
      icon: Clock,
      category: "任务查询"
    },
    {
      id: 3,
      text: "生成本周的项目风险评估报告",
      icon: AlertTriangle,
      category: "风险分析"
    },
    {
      id: 4,
      text: "查看团队效能最高的项目",
      icon: Zap,
      category: "效能分析"
    },
    {
      id: 5,
      text: "哪些任务即将到期需要关注？",
      icon: Clock,
      category: "进度跟踪"
    },
    {
      id: 6,
      text: "帮我分析项目延期的主要原因",
      icon: AlertTriangle,
      category: "问题分析"
    }
  ];

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: '您好！我是AI项目管理助手。我可以帮您：\n\n• 创建和管理项目任务\n• 查询项目进度和状态\n• 生成风险评估报告\n• 分析团队效能数据\n• 提供项目管理建议\n\n请告诉我您需要什么帮助？',
      timestamp: new Date().toLocaleTimeString(),
      suggestions: quickQuestions.slice(0, 3)
    };
    setMessages([welcomeMessage]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await difyApiService.chat.sendMessage(textToSend, {
        conversation_id: conversationId,
        context: 'project_management'
      });

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.answer,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: getContextualSuggestions(textToSend)
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        if (response.data.conversation_id) {
          setConversationId(response.data.conversation_id);
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '抱歉，我暂时无法处理您的请求。请稍后再试。',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 根据用户输入获取相关建议
  const getContextualSuggestions = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes('任务') || input.includes('创建')) {
      return quickQuestions.filter(q => q.category === '任务管理').slice(0, 2);
    } else if (input.includes('风险') || input.includes('报告')) {
      return quickQuestions.filter(q => q.category === '风险分析').slice(0, 2);
    } else if (input.includes('效能') || input.includes('团队')) {
      return quickQuestions.filter(q => q.category === '效能分析').slice(0, 2);
    }
    return quickQuestions.slice(0, 2);
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question.text);
  };

  const clearConversation = () => {
    if (window.confirm('确定要清空对话历史吗？')) {
      setMessages([]);
      setConversationId(null);
      // 重新添加欢迎消息
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now(),
          type: 'ai',
          content: '对话已清空。我是AI项目管理助手，请告诉我您需要什么帮助？',
          timestamp: new Date().toLocaleTimeString(),
          suggestions: quickQuestions.slice(0, 3)
        };
        setMessages([welcomeMessage]);
      }, 100);
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // 这里可以添加复制成功的提示
  };

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `[${msg.timestamp}] ${msg.type === 'user' ? '用户' : 'AI助手'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI助手对话记录_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI智能助手</h1>
          <p className="text-gray-600 mt-1">通过对话式交互管理您的项目</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportConversation}
            className="btn btn-secondary"
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            导出对话
          </button>
          <button
            onClick={clearConversation}
            className="btn btn-secondary"
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            清空对话
          </button>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* 头像 */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary-600' 
                    : message.isError 
                      ? 'bg-danger-600' 
                      : 'bg-gray-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* 消息内容 */}
                <div className={`flex-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block px-4 py-3 rounded-lg max-w-full ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.isError
                        ? 'bg-danger-50 text-danger-800 border border-danger-200'
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  
                  {/* 时间戳和操作 */}
                  <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{message.timestamp}</span>
                    {message.type === 'ai' && !message.isError && (
                      <>
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="hover:text-gray-700"
                          title="复制消息"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="hover:text-gray-700" title="有用">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="hover:text-gray-700" title="无用">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* AI建议 */}
                  {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">您可能还想问：</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => {
                          const Icon = suggestion.icon;
                          return (
                            <button
                              key={suggestion.id}
                              onClick={() => handleQuickQuestion(suggestion)}
                              className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              <Icon className="w-3 h-3 mr-1 text-gray-400" />
                              {suggestion.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* 加载指示器 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 快捷问题（仅在没有对话时显示） */}
        {messages.length <= 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">常用功能：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickQuestions.map((question) => {
                const Icon = question.icon;
                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuickQuestion(question)}
                    className="flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{question.text}</div>
                      <div className="text-xs text-gray-500">{question.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                className="input"
                placeholder="输入您的问题或需求..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="btn btn-primary"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            按 Enter 发送消息，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;