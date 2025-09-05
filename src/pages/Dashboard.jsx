import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { difyApiService } from '../services/difyApi';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // 模拟数据
  const mockData = {
    stats: {
      totalProjects: 12,
      activeProjects: 8,
      completedTasks: 156,
      pendingTasks: 43,
      teamMembers: 24,
      riskAlerts: 5
    },
    trends: {
      projectProgress: [
        { month: '1月', completed: 45, planned: 50 },
        { month: '2月', completed: 52, planned: 55 },
        { month: '3月', completed: 48, planned: 60 },
        { month: '4月', completed: 61, planned: 65 },
        { month: '5月', completed: 55, planned: 70 },
        { month: '6月', completed: 67, planned: 75 }
      ],
      taskDistribution: [
        { name: '已完成', value: 156, color: '#22c55e' },
        { name: '进行中', value: 43, color: '#3b82f6' },
        { name: '待开始', value: 28, color: '#f59e0b' },
        { name: '已逾期', value: 12, color: '#ef4444' }
      ],
      teamVelocity: [
        { week: 'W1', velocity: 23 },
        { week: 'W2', velocity: 27 },
        { week: 'W3', velocity: 31 },
        { week: 'W4', velocity: 28 },
        { week: 'W5', velocity: 35 },
        { week: 'W6', velocity: 32 }
      ]
    },
    recentActivities: [
      {
        id: 1,
        type: 'task_completed',
        message: '张三完成了"用户登录功能开发"任务',
        time: '2分钟前',
        icon: CheckCircle,
        color: 'text-success-600'
      },
      {
        id: 2,
        type: 'risk_alert',
        message: '检测到项目"电商平台升级"存在进度延期风险',
        time: '15分钟前',
        icon: AlertTriangle,
        color: 'text-warning-600'
      },
      {
        id: 3,
        type: 'task_assigned',
        message: '李四被分配了新任务"数据库性能优化"',
        time: '1小时前',
        icon: Users,
        color: 'text-primary-600'
      },
      {
        id: 4,
        type: 'milestone',
        message: '项目"用户中心重构"达成重要里程碑',
        time: '2小时前',
        icon: Target,
        color: 'text-success-600'
      }
    ],
    upcomingDeadlines: [
      {
        id: 1,
        task: '移动端UI设计完成',
        project: '电商平台升级',
        deadline: '2024-01-20',
        daysLeft: 3,
        priority: 'high'
      },
      {
        id: 2,
        task: '支付模块测试',
        project: '支付系统优化',
        deadline: '2024-01-22',
        daysLeft: 5,
        priority: 'medium'
      },
      {
        id: 3,
        task: '用户反馈收集',
        project: '用户中心重构',
        deadline: '2024-01-25',
        daysLeft: 8,
        priority: 'low'
      }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 这里可以调用真实的API
        // const response = await difyApiService.reports.getDashboardData();
        // setDashboardData(response.data);
        
        // 模拟API调用延迟
        setTimeout(() => {
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('获取仪表板数据失败:', error);
        setDashboardData(mockData);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { stats, trends, recentActivities, upcomingDeadlines } = dashboardData;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">项目概览</h1>
          <p className="text-gray-600 mt-1">实时监控项目进展和团队效能</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            本月报告
          </button>
          <button className="btn btn-primary">
            <Activity className="w-4 h-4 mr-2" />
            实时监控
          </button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃项目</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% 较上月
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成任务</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% 较上周
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">团队成员</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamMembers}</p>
              <p className="text-xs text-primary-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +2 新成员
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">风险预警</p>
              <p className="text-2xl font-bold text-gray-900">{stats.riskAlerts}</p>
              <p className="text-xs text-danger-600 flex items-center mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                -2 较昨日
              </p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 项目进度趋势 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">项目进度趋势</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-1"></div>
                实际完成
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                计划完成
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends.projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="planned" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 任务分布 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trends.taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {trends.taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {trends.taskDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 团队效能和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 团队速度 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">团队速度</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trends.teamVelocity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="velocity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 最近活动 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 即将到期 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">即将到期</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((item) => (
              <div key={item.id} className="border-l-4 border-primary-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{item.task}</h4>
                  <span className={`badge ${
                    item.priority === 'high' ? 'badge-danger' :
                    item.priority === 'medium' ? 'badge-warning' : 'badge-gray'
                  }`}>
                    {item.daysLeft}天
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{item.project}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;