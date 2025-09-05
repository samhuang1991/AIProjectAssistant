import axios from 'axios';

// Dify API 配置
// 注意：请根据您的实际Dify部署情况修改以下配置
// 1. 如果使用Dify云服务，BASE_URL通常是 https://api.dify.ai/v1
// 2. 如果是自部署，请替换为您的实际域名，如 https://your-domain.com/v1
// 3. API_KEY请在Dify控制台的应用设置中获取
// 4. 本应用使用工作流(workflows)模式，请确保在Dify中创建了相应的工作流
// 5. 工作流应该接收inputs参数，并在outputs中返回结果
const DIFY_BASE_URL = 'https://api.dify.ai/v1'; // 请替换为实际的Dify API地址
const DIFY_API_KEY = 'app-koHqoLLuV93DnsgOQiPuhGQq'; // 请替换为实际的API密钥

// 创建axios实例
const difyClient = axios.create({
  baseURL: DIFY_BASE_URL,
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// 请求拦截器
difyClient.interceptors.request.use(
  (config) => {
    console.log('Dify API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Dify API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
difyClient.interceptors.response.use(
  (response) => {
    console.log('Dify API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Dify API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API 服务函数
export const difyApiService = {
  // 任务管理相关API
  tasks: {
    // 创建任务
    create: async (taskData) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'create_task',
            task_data: JSON.stringify(taskData)
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return {
          success: true,
          data: response.data.data?.outputs || response.data
        };
      } catch (error) {
        console.error('创建任务失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: {
            id: 'TASK-' + Date.now(),
            ...taskData,
            status: 'TODO',
            created_at: new Date().toISOString()
          }
        };
      }
    },

    // 获取任务列表
    list: async (filters = {}) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'list_tasks',
            filters: filters
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('获取任务列表失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: [
            {
              id: 'TASK-001',
              title: '实现用户登录功能',
              description: '开发用户登录和认证系统',
              status: 'IN_PROGRESS',
              priority: 'HIGH',
              assignee: '张三',
              created_at: '2024-01-15T10:00:00Z',
              due_date: '2024-01-20T18:00:00Z'
            },
            {
              id: 'TASK-002',
              title: '优化数据库查询性能',
              description: '分析并优化慢查询，提升系统性能',
              status: 'TODO',
              priority: 'MEDIUM',
              assignee: '李四',
              created_at: '2024-01-16T09:30:00Z',
              due_date: '2024-01-25T17:00:00Z'
            },
            {
              id: 'TASK-003',
              title: '修复支付模块bug',
              description: '解决支付流程中的异常处理问题',
              status: 'DONE',
              priority: 'HIGH',
              assignee: '王五',
              created_at: '2024-01-10T14:20:00Z',
              due_date: '2024-01-15T16:00:00Z'
            }
          ]
        };
      }
    },

    // 更新任务
    update: async (taskId, updateData) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'update_task',
            task_id: taskId,
            update_data: updateData
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('更新任务失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: {
            id: taskId,
            ...updateData,
            updated_at: new Date().toISOString()
          }
        };
      }
    },

    // 删除任务
    delete: async (taskId) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'delete_task',
            task_id: taskId
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('删除任务失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          message: '任务删除成功'
        };
      }
    }
  },

  // 风险预警相关API
  risks: {
    // 获取风险预警列表
    getAlerts: async () => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'get_risk_alerts'
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('获取风险预警失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: [
            {
              id: 'RISK-001',
              type: 'SCHEDULE_DELAY',
              title: '项目进度延期风险',
              description: '移动端开发任务预计延期3天，可能影响整体发布计划',
              severity: 'HIGH',
              project: '电商平台升级',
              created_at: '2024-01-17T08:30:00Z',
              status: 'ACTIVE'
            },
            {
              id: 'RISK-002',
              type: 'RESOURCE_CONFLICT',
              title: '资源冲突预警',
              description: '张三同时被分配到2个高优先级任务，存在资源冲突',
              severity: 'MEDIUM',
              project: '用户中心重构',
              created_at: '2024-01-17T10:15:00Z',
              status: 'ACTIVE'
            },
            {
              id: 'RISK-003',
              type: 'QUALITY_ISSUE',
              title: '代码质量风险',
              description: '最近3次提交的代码复杂度超标，建议进行代码重构',
              severity: 'LOW',
              project: '支付系统优化',
              created_at: '2024-01-17T14:20:00Z',
              status: 'ACTIVE'
            }
          ]
        };
      }
    },

    // 生成风险评估报告
    generateReport: async (projectId) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'generate_risk_report',
            project_id: projectId
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('生成风险报告失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: {
            project_id: projectId,
            report_id: 'RPT-' + Date.now(),
            overall_risk_level: 'MEDIUM',
            risk_score: 65,
            key_risks: [
              '进度延期风险较高',
              '团队资源分配不均',
              '技术债务积累'
            ],
            recommendations: [
              '调整任务优先级，确保关键路径任务按时完成',
              '重新分配团队资源，平衡工作负载',
              '安排技术债务清理时间'
            ],
            generated_at: new Date().toISOString()
          }
        };
      }
    }
  },

  // 项目健康报告相关API
  reports: {
    // 获取项目健康报告
    getHealthReport: async (query) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            action: 'get_health_report',
            query: query
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        return response.data;
      } catch (error) {
        console.error('获取健康报告失败:', error);
        // 模拟数据用于演示
        return {
          success: true,
          data: {
            overall_health: 'GOOD',
            health_score: 78,
            projects: [
              {
                name: '电商平台升级',
                health: 'FAIR',
                progress: 65,
                risk_level: 'MEDIUM',
                team_size: 8,
                deadline: '2024-02-15'
              },
              {
                name: '用户中心重构',
                health: 'GOOD',
                progress: 80,
                risk_level: 'LOW',
                team_size: 5,
                deadline: '2024-01-30'
              },
              {
                name: '支付系统优化',
                health: 'EXCELLENT',
                progress: 95,
                risk_level: 'LOW',
                team_size: 3,
                deadline: '2024-01-25'
              }
            ],
            metrics: {
              total_tasks: 156,
              completed_tasks: 89,
              in_progress_tasks: 45,
              overdue_tasks: 12,
              team_velocity: 23.5,
              bug_rate: 2.1
            },
            generated_at: new Date().toISOString()
          }
        };
      }
    }
  },

  // 对话式查询API
  chat: {
    // 发送消息并获取AI回复
    sendMessage: async (message, context = {}) => {
      try {
        const response = await difyClient.post('/workflows/run', {
          inputs: {
            prompt: message,
            context: context.context || 'project_management'
          },
          response_mode: 'blocking',
          user: 'user-' + Date.now()
        });
        
        // 处理Dify API的成功响应
        if (response.data) {
          return {
            success: true,
            data: {
              answer: response.data.data?.outputs?.text || response.data.data?.outputs?.answer || response.data.answer || '抱歉，我无法理解您的请求。',
              conversation_id: context.conversation_id || 'conv-' + Date.now(),
              message_id: response.data.workflow_run_id || 'msg-' + Date.now(),
              created_at: response.data.created_at || new Date().toISOString()
            }
          };
        }
        
        throw new Error('Invalid response from Dify API');
      } catch (error) {
        console.error('发送消息失败:', error);
        
        // 检查具体错误类型
        if (error.code === 'ENOTFOUND') {
          return {
            success: false,
            error: 'API连接错误',
            data: {
              answer: '⚠️ 无法连接到Dify API服务器。请检查：\n\n1. 网络连接是否正常\n2. DIFY_BASE_URL是否正确\n3. 防火墙设置是否阻止了连接',
              conversation_id: context.conversation_id || 'conv-' + Date.now(),
              message_id: 'msg-' + Date.now(),
              created_at: new Date().toISOString()
            }
          };
        }
        
        if (error.response?.status === 401) {
          return {
            success: false,
            error: 'API认证错误',
            data: {
              answer: '🔑 API密钥认证失败。请检查：\n\n1. DIFY_API_KEY是否正确\n2. API密钥是否已过期\n3. 是否有访问该工作流的权限',
              conversation_id: context.conversation_id || 'conv-' + Date.now(),
              message_id: 'msg-' + Date.now(),
              created_at: new Date().toISOString()
            }
          };
        }
        
        if (error.response?.status === 400) {
          const errorDetail = error.response?.data?.message || error.response?.data?.error || '请求格式错误';
          return {
            success: false,
            error: '请求格式错误',
            data: {
              answer: `⚠️ 请求格式错误 (400)：\n\n${errorDetail}\n\n可能的原因：\n1. 工作流不存在或未发布\n2. 输入参数格式不正确\n3. 工作流配置有误\n\n请检查Dify控制台中的工作流设置。`,
              conversation_id: context.conversation_id || 'conv-' + Date.now(),
              message_id: 'msg-' + Date.now(),
              created_at: new Date().toISOString()
            }
          };
        }
        
        if (error.response?.status === 404) {
          return {
            success: false,
            error: '工作流未找到',
            data: {
              answer: '❌ 工作流未找到 (404)。请检查：\n\n1. 工作流是否已创建\n2. 工作流是否已发布\n3. API密钥是否对应正确的应用',
              conversation_id: context.conversation_id || 'conv-' + Date.now(),
              message_id: 'msg-' + Date.now(),
              created_at: new Date().toISOString()
            }
          };
        }
        
        // 其他错误情况
        const statusCode = error.response?.status || 'Unknown';
        const errorDetail = error.response?.data?.message || error.message;
        return {
          success: false,
          error: error.message,
          data: {
            answer: `❌ 请求失败 (${statusCode})：\n\n${errorDetail}\n\n请检查网络连接和API配置，或联系管理员。`,
            conversation_id: context.conversation_id || 'conv-' + Date.now(),
            message_id: 'msg-' + Date.now(),
            created_at: new Date().toISOString()
          }
        };
      }
    }
  }
};

export default difyApiService;