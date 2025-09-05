import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  FileText,
  RefreshCw,
  Filter,
  Search,
  Eye,
  CheckCircle,
  X,
  Calendar,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { difyApiService } from '../services/difyApi';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskReport, setRiskReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // 风险严重程度颜色映射
  const severityColors = {
    HIGH: 'border-danger-500 bg-danger-50',
    MEDIUM: 'border-warning-500 bg-warning-50',
    LOW: 'border-gray-500 bg-gray-50'
  };

  // 风险严重程度标签颜色
  const severityBadgeColors = {
    HIGH: 'badge-danger',
    MEDIUM: 'badge-warning',
    LOW: 'badge-gray'
  };

  // 风险类型图标映射
  const riskTypeIcons = {
    SCHEDULE_DELAY: Clock,
    RESOURCE_CONFLICT: Users,
    QUALITY_ISSUE: Target,
    BUDGET_OVERRUN: TrendingUp,
    TECHNICAL_DEBT: Activity
  };

  // 风险类型中文映射
  const riskTypeLabels = {
    SCHEDULE_DELAY: '进度延期',
    RESOURCE_CONFLICT: '资源冲突',
    QUALITY_ISSUE: '质量问题',
    BUDGET_OVERRUN: '预算超支',
    TECHNICAL_DEBT: '技术债务'
  };

  // 严重程度中文映射
  const severityLabels = {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低'
  };

  useEffect(() => {
    fetchRiskAlerts();
  }, []);

  const fetchRiskAlerts = async () => {
    try {
      setLoading(true);
      const response = await difyApiService.risks.getAlerts();
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (error) {
      console.error('获取风险预警失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRiskReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await difyApiService.risks.generateReport('all-projects');
      if (response.success) {
        setRiskReport(response.data);
      }
    } catch (error) {
      console.error('生成风险报告失败:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleMarkAsResolved = async (alertId) => {
    try {
      // 这里应该调用API标记为已解决
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'RESOLVED' } : alert
      ));
    } catch (error) {
      console.error('标记风险为已解决失败:', error);
    }
  };

  const openAlertDetail = (alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  // 过滤风险预警
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    const isActive = alert.status === 'ACTIVE';
    return matchesSearch && matchesSeverity && matchesType && isActive;
  });

  // 统计数据
  const stats = {
    total: alerts.filter(a => a.status === 'ACTIVE').length,
    high: alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'HIGH').length,
    medium: alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'MEDIUM').length,
    low: alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'LOW').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">风险预警中心</h1>
          <p className="text-gray-600 mt-1">主动监控项目风险，及时预警潜在问题</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchRiskAlerts}
            className="btn btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </button>
          <button
            onClick={generateRiskReport}
            disabled={generatingReport}
            className="btn btn-primary"
          >
            {generatingReport ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            生成报告
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总风险数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">高风险</p>
              <p className="text-2xl font-bold text-danger-600">{stats.high}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <Zap className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">中风险</p>
              <p className="text-2xl font-bold text-warning-600">{stats.medium}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">低风险</p>
              <p className="text-2xl font-bold text-gray-600">{stats.low}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索风险预警..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="input w-auto"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="all">全部严重程度</option>
            <option value="HIGH">高</option>
            <option value="MEDIUM">中</option>
            <option value="LOW">低</option>
          </select>
          <select
            className="input w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">全部类型</option>
            <option value="SCHEDULE_DELAY">进度延期</option>
            <option value="RESOURCE_CONFLICT">资源冲突</option>
            <option value="QUALITY_ISSUE">质量问题</option>
            <option value="BUDGET_OVERRUN">预算超支</option>
            <option value="TECHNICAL_DEBT">技术债务</option>
          </select>
        </div>
      </div>

      {/* 风险预警列表 */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = riskTypeIcons[alert.type] || AlertTriangle;
          return (
            <div
              key={alert.id}
              className={`card border-l-4 ${severityColors[alert.severity]} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'HIGH' ? 'bg-danger-100' :
                    alert.severity === 'MEDIUM' ? 'bg-warning-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      alert.severity === 'HIGH' ? 'text-danger-600' :
                      alert.severity === 'MEDIUM' ? 'text-warning-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`badge ${severityBadgeColors[alert.severity]}`}>
                        {severityLabels[alert.severity]}风险
                      </span>
                      <span className="badge badge-primary">
                        {riskTypeLabels[alert.type]}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {alert.project}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(alert.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAlertDetail(alert)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    详情
                  </button>
                  <button
                    onClick={() => handleMarkAsResolved(alert.id)}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    已解决
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活跃风险</h3>
          <p className="text-gray-600">当前没有需要关注的风险预警</p>
        </div>
      )}

      {/* 风险报告 */}
      {riskReport && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">风险评估报告</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">整体风险评估</h4>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  riskReport.overall_risk_level === 'HIGH' ? 'bg-danger-100 text-danger-800' :
                  riskReport.overall_risk_level === 'MEDIUM' ? 'bg-warning-100 text-warning-800' :
                  'bg-success-100 text-success-800'
                }`}>
                  {riskReport.overall_risk_level === 'HIGH' ? '高风险' :
                   riskReport.overall_risk_level === 'MEDIUM' ? '中风险' : '低风险'}
                </div>
                <span className="text-2xl font-bold text-gray-900">{riskReport.risk_score}/100</span>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700">主要风险:</h5>
                <ul className="space-y-1">
                  {riskReport.key_risks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-2 text-warning-500" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">改进建议</h4>
              <ul className="space-y-2">
                {riskReport.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <CheckCircle className="w-3 h-3 mr-2 text-success-500 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              报告生成时间: {new Date(riskReport.generated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* 风险详情模态框 */}
      {showDetailModal && selectedAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">风险详情</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedAlert.title}</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`badge ${severityBadgeColors[selectedAlert.severity]}`}>
                      {severityLabels[selectedAlert.severity]}风险
                    </span>
                    <span className="badge badge-primary">
                      {riskTypeLabels[selectedAlert.type]}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">详细描述</h5>
                  <p className="text-gray-600">{selectedAlert.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">相关项目</h5>
                    <p className="text-gray-600">{selectedAlert.project}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">发现时间</h5>
                    <p className="text-gray-600">{new Date(selectedAlert.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="btn btn-secondary"
                  >
                    关闭
                  </button>
                  <button
                    onClick={() => {
                      handleMarkAsResolved(selectedAlert.id);
                      setShowDetailModal(false);
                    }}
                    className="btn btn-success"
                  >
                    标记为已解决
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAlerts;