import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  MessageSquare,
  Send,
  Calendar,
  Users,
  Target,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  FileText,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { difyApiService } from '../services/difyApi';

const HealthReports = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedProjects, setSelectedProjects] = useState('all');

  // 健康状态颜色映射
  const healthColors = {
    EXCELLENT: '#22c55e',
    GOOD: '#3b82f6',
    FAIR: '#f59e0b',
    POOR: '#ef4444'
  };

  // 健康状态标签
  const healthLabels = {
    EXCELLENT: '优秀',
    GOOD: '良好',
    FAIR: '一般',
    POOR: '较差'
  };

  useEffect(() => {
    fetchHealthReport();
  }, [selectedTimeRange, selectedProjects]);

  const fetchHealthReport = async () => {
    try {
      setLoading(true);
      const query = `获取${selectedTimeRange === '7d' ? '最近7天' : selectedTimeRange === '30d' ? '最近30天' : '最近90天'}的项目健康报告`;
      const response = await difyApiService.reports.getHealthReport(query);
      if (response.success) {
        setHealthData(response.data);
      }
    } catch (error) {
      console.error('获取健康报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalQuery = async () => {
    if (!queryText.trim()) return;

    try {
      setQueryLoading(true);
      const response = await difyApiService.reports.getHealthReport(queryText);
      if (response.success) {
        setQueryResult({
          query: queryText,
          result: response.data,
          timestamp: new Date().toLocaleString()
        });
      }
    } catch (error) {
      console.error('查询失败:', error);
    } finally {
      setQueryLoading(false);
    }
  };

  const exportReport = () => {
    // 这里可以实现报告导出功能
    console.log('导出报告');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
        <p className="text-gray-600">无法获取项目健康报告数据</p>
      </div>
    );
  }

  const { overall_health, health_score, projects, metrics } = healthData;

  // 准备图表数据
  const projectHealthData = projects.map(project => ({
    name: project.name,
    health_score: project.progress,
    risk_level: project.risk_level === 'LOW' ? 1 : project.risk_level === 'MEDIUM' ? 2 : 3,
    team_size: project.team_size
  }));

  const metricsData = [
    { name: '已完成', value: metrics.completed_tasks, color: '#22c55e' },
    { name: '进行中', value: metrics.in_progress_tasks, color: '#3b82f6' },
    { name: '逾期', value: metrics.overdue_tasks, color: '#ef4444' }
  ];

  const velocityData = [
    { week: 'W1', velocity: 20 },
    { week: 'W2', velocity: 25 },
    { week: 'W3', velocity: 23 },
    { week: 'W4', velocity: 28 },
    { week: 'W5', velocity: metrics.team_velocity },
    { week: 'W6', velocity: 26 }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">项目健康报告</h1>
          <p className="text-gray-600 mt-1">通过自然语言查询获取项目全局视图</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            className="input w-auto"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
          <button
            onClick={fetchHealthReport}
            className="btn btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </button>
          <button
            onClick={exportReport}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 自然语言查询 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">智能查询</h3>
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              className="input"
              placeholder="例如：显示本月进度最慢的项目，或者哪个团队的效率最高？"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNaturalQuery()}
            />
          </div>
          <button
            onClick={handleNaturalQuery}
            disabled={queryLoading || !queryText.trim()}
            className="btn btn-primary"
          >
            {queryLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            查询
          </button>
        </div>
        
        {/* 查询结果 */}
        {queryResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">查询结果</h4>
              <span className="text-xs text-gray-500">{queryResult.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">查询: "{queryResult.query}"</p>
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-800">基于当前数据分析，项目整体健康状况为{healthLabels[overall_health]}，健康评分{health_score}分。建议重点关注进度较慢的项目，优化资源配置。</p>
            </div>
          </div>
        )}
      </div>

      {/* 整体健康状况 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">整体健康状况</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: health_score }]}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={healthColors[overall_health]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{health_score}</div>
                  <div className="text-xs text-gray-500">分</div>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}
                 style={{ backgroundColor: healthColors[overall_health] + '20', color: healthColors[overall_health] }}>
              {healthLabels[overall_health]}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">关键指标</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="p-3 bg-primary-100 rounded-lg mb-2 inline-block">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.total_tasks}</div>
                <div className="text-sm text-gray-600">总任务数</div>
              </div>
              <div className="text-center">
                <div className="p-3 bg-success-100 rounded-lg mb-2 inline-block">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.completed_tasks}</div>
                <div className="text-sm text-gray-600">已完成</div>
              </div>
              <div className="text-center">
                <div className="p-3 bg-warning-100 rounded-lg mb-2 inline-block">
                  <Clock className="w-6 h-6 text-warning-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.overdue_tasks}</div>
                <div className="text-sm text-gray-600">逾期任务</div>
              </div>
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-lg mb-2 inline-block">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.team_velocity}</div>
                <div className="text-sm text-gray-600">团队速度</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 项目健康状况和任务分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">项目健康状况</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectHealthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="health_score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metricsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {metricsData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 团队效能趋势 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">团队效能趋势</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 项目详细列表 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">项目详情</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  项目名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  健康状况
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  进度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  风险等级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  团队规模
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  截止日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                          style={{ backgroundColor: healthColors[project.health] + '20', color: healthColors[project.health] }}>
                      {healthLabels[project.health]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      project.risk_level === 'HIGH' ? 'badge-danger' :
                      project.risk_level === 'MEDIUM' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {project.risk_level === 'HIGH' ? '高' :
                       project.risk_level === 'MEDIUM' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.team_size} 人
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthReports;