import { useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, AlertCircle, ArrowRight, BarChart3, Bell, BookOpen, Bookmark,
  Bot, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardCheck, Clock3, Database, Download, Edit3, ExternalLink, FileBarChart,
  FileCheck2, FileSearch, FileText, Filter, Gauge, GitBranch, History, Home,
  Landmark, LayoutDashboard, Library, ListChecks, LockKeyhole, Menu, MessageSquare,
  Network, PanelLeftClose, PanelLeftOpen, Plus, RefreshCw, RotateCcw, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, Tags, Upload, UserCog,
  Users, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  adminTasks, documents, institutions, metrics, penalties, penaltyTrend,
  qualityIssues, reports, searchGroups, terms, updates,
} from './data'

const userNav = [
  { label: '工作台', icon: Home, to: '/' },
  { label: '统一搜索', icon: Search, to: '/search' },
  { group: '制度知识' },
  { label: '监管制度文档库', icon: Library, to: '/knowledge/docs' },
  { label: '监管术语与标准', icon: Tags, to: '/knowledge/terms' },
  { label: '业务合规约束库', icon: ShieldCheck, to: '/knowledge/constraints' },
  { label: '能力评估框架', icon: Gauge, to: '/knowledge/frameworks' },
  { group: '监管数据' },
  { label: '监管报表库', icon: FileBarChart, to: '/regulatory/reports' },
  { label: '监管指标库', icon: Activity, to: '/regulatory/metrics' },
  { label: '监管数据质量', icon: ClipboardCheck, to: '/regulatory/quality' },
  { label: '金融机构名单', icon: Building2, to: '/regulatory/institutions' },
  { group: '研究分析' },
  { label: '监管处罚分析', icon: AlertCircle, to: '/analysis/penalties' },
  { label: '年报与披露资料', icon: FileText, to: '/analysis/annual-reports' },
  { label: '知识图谱', icon: Network, to: '/analysis/graph' },
  { label: '专题研究', icon: BookOpen, to: '/analysis/topics' },
  { group: '智能工具' },
  { label: 'AI 工作台', icon: Sparkles, to: '/ai' },
  { label: '收藏与历史', icon: Bookmark, to: '/favorites' },
]

const adminNav = [
  { label: '管理概览', icon: LayoutDashboard, to: '/admin' },
  { label: '知识文档管理', icon: FileText, to: '/admin/documents' },
  { label: '报表配置中心', icon: FileBarChart, to: '/admin/reports' },
  { label: '指标与释疑', icon: Activity, to: '/admin/metrics' },
  { label: '内容发布中心', icon: FileCheck2, to: '/admin/publish' },
  { label: '用户管理', icon: Users, to: '/admin/users' },
  { label: '系统配置', icon: Settings, to: '/admin/settings' },
]

const topicColors = {
  green: 'var(--green)', blue: 'var(--blue)', amber: 'var(--amber)', red: 'var(--red)',
}

function Logo({ compact }) {
  return <div className="brand">
    <span className="brand-mark"><Landmark size={20} strokeWidth={2.1} /></span>
    {!compact && <span><b>银规智库</b><small>Bank Regulatory Intelligence</small></span>}
  </div>
}

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function AppShell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = isAdmin ? adminNav : userNav

  const switchMode = () => navigate(isAdmin ? '/' : '/admin')

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="关闭菜单" />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-head">
        <Logo compact={collapsed} />
        <button className="icon-button close-mobile" onClick={() => setMobileOpen(false)} aria-label="关闭菜单"><X size={18} /></button>
      </div>
      <nav className="nav-list">
        {nav.map((item, index) => item.group
          ? (!collapsed && <div className="nav-group" key={`${item.group}-${index}`}>{item.group}</div>)
          : <NavLink key={item.to} to={item.to} end={item.to === '/' || item.to === '/admin'} title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={18} />{!collapsed && <span>{item.label}</span>}
            </NavLink>)}
      </nav>
      <div className="sidebar-foot">
        <button className="mode-switch" onClick={switchMode}>
          {isAdmin ? <Home size={17} /> : <UserCog size={17} />}
          {!collapsed && <span>{isAdmin ? '返回用户端' : '进入管理后台'}</span>}
        </button>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? '展开侧栏' : '收起侧栏'}>
          {collapsed ? <PanelLeftOpen size={17} /> : <><PanelLeftClose size={17} /><span>收起菜单</span></>}
        </button>
      </div>
    </aside>
    <section className="main-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button menu-mobile" onClick={() => setMobileOpen(true)} aria-label="打开菜单"><Menu size={20} /></button>
          <div className="scope-chip"><span className={`status-dot ${isAdmin ? 'admin-dot' : ''}`} />{isAdmin ? '管理员工作区' : '知识查询工作区'}</div>
        </div>
        <div className="topbar-actions">
          <button className="global-search" onClick={() => navigate('/search')}><Search size={16} /><span>搜索制度、报表、指标</span><kbd>Ctrl K</kbd></button>
          <button className="icon-button" title="消息"><Bell size={18} /><i className="notification-dot" /></button>
          <div className="user-menu"><span className="avatar">管</span><span className="user-copy"><b>平台管理员</b><small>{isAdmin ? '管理员' : '普通用户视图'}</small></span><ChevronDown size={15} /></div>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </section>
  </div>
}

function PageHeader({ title, description, eyebrow, actions }) {
  return <div className="page-header">
    <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>
}

function Stat({ label, value, meta, icon: Icon, tone = 'green' }) {
  return <div className="stat-card">
    <span className={`stat-icon tone-${tone}`}><Icon size={19} /></span>
    <div><p>{label}</p><strong>{value}</strong><small>{meta}</small></div>
  </div>
}

function FilterBar({ placeholder = '输入关键词搜索', onSearch, children }) {
  const [value, setValue] = useState('')
  return <div className="filter-bar">
    <label className="search-input"><Search size={17} /><input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch?.(value)} placeholder={placeholder} /><button onClick={() => onSearch?.(value)}>搜索</button></label>
    <div className="filter-actions">{children}<button className="button ghost"><Filter size={16} />更多筛选</button></div>
  </div>
}

function Select({ children, label }) {
  return <label className="select-control"><span>{label}</span><select defaultValue="全部"><option>全部</option>{children}</select><ChevronDown size={14} /></label>
}

function Drawer({ title, subtitle, open, onClose, children, footer }) {
  if (!open) return null
  return <>
    <button className="drawer-overlay" onClick={onClose} aria-label="关闭详情" />
    <aside className="drawer">
      <div className="drawer-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose}><X size={19} /></button></div>
      <div className="drawer-body">{children}</div>
      {footer && <div className="drawer-footer">{footer}</div>}
    </aside>
  </>
}

function EmptyNote({ icon: Icon = CircleHelp, title, text }) {
  return <div className="empty-note"><Icon size={25} /><b>{title}</b><span>{text}</span></div>
}

function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const goSearch = () => navigate(`/search?q=${encodeURIComponent(query)}`)
  const trend = [
    { day: '10/08', value: 162 }, { day: '10/09', value: 204 }, { day: '10/10', value: 188 },
    { day: '10/11', value: 238 }, { day: '10/12', value: 226 }, { day: '10/13', value: 274 }, { day: '10/14', value: 312 },
  ]
  return <>
    <section className="welcome-band">
      <div className="welcome-copy"><span className="eyebrow light">BANKING REGULATORY INTELLIGENCE</span><h1>让监管知识，成为判断的依据</h1><p>从制度原文到报表字段，从指标口径到处罚案例，一站检索、关联与溯源。</p>
        <label className="hero-search"><Search size={20} /><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && goSearch()} placeholder="搜索制度、文号、报表字段、监管指标…" /><button onClick={goSearch}>开始检索 <ArrowRight size={16} /></button></label>
        <div className="search-suggestions"><span>热门：</span><button onClick={() => navigate('/regulatory/metrics')}>资本充足率</button><button onClick={() => navigate('/knowledge/docs')}>数据治理</button><button onClick={() => navigate('/analysis/penalties')}>监管处罚</button></div>
      </div>
      <div className="welcome-visual" aria-label="知识资产概览">
        <div className="visual-grid" />
        <div className="visual-kpi"><small>已关联知识对象</small><b>62,418</b><span><Zap size={14} /> 今日新增 126</span></div>
        <div className="visual-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="workArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#55d6a0" stopOpacity={0.42}/><stop offset="100%" stopColor="#55d6a0" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="value" stroke="#55d6a0" fill="url(#workArea)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div>
      </div>
    </section>

    <section className="stats-grid">
      <Stat label="监管制度" value="3,284" meta="本月更新 42" icon={Library} tone="green" />
      <Stat label="监管报表" value="168" meta="覆盖 12 个体系" icon={FileBarChart} tone="blue" />
      <Stat label="监管指标" value="426" meta="含 218 条释疑" icon={Activity} tone="amber" />
      <Stat label="处罚案例" value="26,090" meta="本周新增 126" icon={AlertCircle} tone="red" />
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">WORK DOMAINS</span><h2>核心工作场景</h2></div><button className="text-button" onClick={() => navigate('/search')}>查看全部知识 <ArrowRight size={15} /></button></div>
      <div className="domain-grid">
        <button className="domain-card" onClick={() => navigate('/knowledge/docs')}><span className="domain-index">01</span><Library size={24}/><h3>制度知识</h3><p>制度原文、条款、术语与业务约束统一管理。</p><span>进入文档库 <ArrowRight size={14}/></span></button>
        <button className="domain-card" onClick={() => navigate('/regulatory/reports')}><span className="domain-index">02</span><FileBarChart size={24}/><h3>监管数据</h3><p>报表、字段、指标与校验规则逐级关联。</p><span>进入报表库 <ArrowRight size={14}/></span></button>
        <button className="domain-card" onClick={() => navigate('/analysis/penalties')}><span className="domain-index">03</span><BarChart3 size={24}/><h3>研究分析</h3><p>处罚、机构、年报与监管主题多维分析。</p><span>进入分析中心 <ArrowRight size={14}/></span></button>
        <button className="domain-card ai-domain" onClick={() => navigate('/ai')}><span className="domain-index">AI</span><Sparkles size={24}/><h3>AI 工作台</h3><p>基于站内权威知识，完成问答、比较与释疑。</p><span>开始对话 <ArrowRight size={14}/></span></button>
      </div>
    </section>

    <section className="dashboard-columns">
      <div className="panel">
        <div className="panel-head"><div><span className="eyebrow">LATEST UPDATES</span><h2>最近更新</h2></div><button className="icon-button"><RefreshCw size={16}/></button></div>
        <div className="update-list">{updates.map((item, i) => <button key={i} className="update-row"><span className="update-type" style={{ borderColor: topicColors[item.tone], color: topicColors[item.tone] }}>{item.type}</span><span><b>{item.title}</b><small>{item.time}</small></span><ChevronRight size={16}/></button>)}</div>
      </div>
      <div className="panel attention-panel">
        <div className="panel-head"><div><span className="eyebrow">REGULATORY SIGNAL</span><h2>监管关注</h2></div><Badge tone="green">近30天</Badge></div>
        <div className="signal-list"><div><span>数据质量与真实性</span><b>86</b><i style={{width:'86%'}}/></div><div><span>授信与贷款管理</span><b>73</b><i style={{width:'73%'}}/></div><div><span>反洗钱义务履行</span><b>61</b><i style={{width:'61%'}}/></div><div><span>关联交易与集中度</span><b>44</b><i style={{width:'44%'}}/></div></div>
        <button className="button secondary" onClick={() => navigate('/analysis/penalties')}>查看处罚趋势 <ArrowRight size={15}/></button>
      </div>
    </section>
  </>
}

function SearchPage() {
  const params = new URLSearchParams(useLocation().search)
  const [query, setQuery] = useState(params.get('q') || '资本充足率')
  const [activeType, setActiveType] = useState('全部')
  const resultDocs = documents.filter(d => !query || `${d.title}${d.summary}${d.tags.join('')}`.includes(query) || query === '资本充足率')
  return <>
    <PageHeader eyebrow="UNIFIED SEARCH" title="统一搜索" description="在制度、条款、报表、字段、指标和处罚案例中同时检索。" />
    <section className="search-stage"><label><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="输入制度名称、文号、指标或自然语言问题"/><button>搜索</button></label><div className="scope-tabs">{['全部', ...searchGroups.map(x=>x.type)].map(t=><button key={t} className={activeType===t?'active':''} onClick={()=>setActiveType(t)}>{t}{t!=='全部' && <small>{searchGroups.find(x=>x.type===t)?.count.toLocaleString()}</small>}</button>)}</div></section>
    <div className="search-layout">
      <aside className="search-filters"><h3><SlidersHorizontal size={16}/>筛选条件</h3><div className="filter-section"><b>效力状态</b>{['现行有效','即将生效','历史版本','已废止'].map((x,i)=><label key={x}><input type="checkbox" defaultChecked={i===0}/><span>{x}</span><small>{[2481,18,624,161][i]}</small></label>)}</div><div className="filter-section"><b>发布机构</b>{['金融监管总局','中国人民银行','国务院','其他机构'].map((x,i)=><label key={x}><input type="checkbox"/><span>{x}</span><small>{[928,674,102,1580][i]}</small></label>)}</div><div className="filter-section"><b>发布时间</b><select><option>不限</option><option>近一年</option><option>近三年</option></select></div></aside>
      <section className="search-results"><div className="result-summary"><span>找到约 <b>1,286</b> 条相关结果，用时 0.18 秒</span><select><option>综合排序</option><option>最新发布</option><option>相关度</option></select></div>
        {[...resultDocs, ...documents].slice(0,5).map((doc,i)=><article className="result-item" key={`${doc.id}-${i}`}><div className="result-meta"><Badge tone={i===2?'amber':'green'}>{i===2?'监管指标':'制度文档'}</Badge><span>{doc.agency}</span><span>{doc.date}</span></div><h3>{doc.title}</h3><p>{doc.summary} 其中<span className="highlight">{query}</span>相关要求应结合适用机构、计量范围和有效版本综合判断。</p><div className="result-footer"><span><FileText size={14}/>{doc.code}</span><button>查看详情 <ArrowRight size={14}/></button></div></article>)}
      </section>
    </div>
  </>
}

function DocumentsPage() {
  const [selected, setSelected] = useState(null)
  return <>
    <PageHeader eyebrow="REGULATORY DOCUMENTS" title="监管制度文档库" description="查找制度原文、沿革版本、条款释义及其关联报表和指标。" actions={<><button className="button ghost"><Download size={16}/>导出清单</button><button className="button primary"><Bell size={16}/>订阅更新</button></>} />
    <FilterBar placeholder="搜索制度名称、文号或条款内容"><Select label="业务主题"><option>资本监管</option><option>流动性风险</option><option>数据治理</option></Select><Select label="效力状态"><option>现行有效</option><option>历史版本</option></Select></FilterBar>
    <div className="content-toolbar"><span>共 <b>3,284</b> 份制度文档</span><div className="view-toggle"><button className="active">列表</button><button>按主题</button><button>按发布机构</button></div></div>
    <div className="document-list">{documents.map(doc=><article className="document-row" key={doc.id} onClick={()=>setSelected(doc)}><div className="document-icon"><FileText size={22}/></div><div className="document-main"><div><Badge tone={doc.status==='现行有效'?'green':'neutral'}>{doc.status}</Badge><span className="doc-type">{doc.type}</span></div><h3>{doc.title}</h3><p>{doc.summary}</p><div className="tag-list">{doc.tags.map(t=><span key={t}>{t}</span>)}</div></div><div className="document-side"><span>{doc.agency}</span><b>{doc.code}</b><small>发布：{doc.date}</small><button className="icon-button"><ChevronRight size={18}/></button></div></article>)}</div>
    <Drawer open={!!selected} onClose={()=>setSelected(null)} title={selected?.title} subtitle={selected?.code} footer={<><button className="button ghost"><Download size={16}/>下载原文</button><button className="button primary">查看完整文档 <ExternalLink size={16}/></button></>}>
      <div className="detail-status"><Badge tone="green">{selected?.status}</Badge><span>生效日期 {selected?.effective}</span></div>
      <div className="detail-grid"><div><small>发布机构</small><b>{selected?.agency}</b></div><div><small>制度层级</small><b>{selected?.type}</b></div><div><small>业务主题</small><b>{selected?.topic}</b></div><div><small>当前版本</small><b>V2.1</b></div></div>
      <section className="drawer-section"><h3>内容摘要</h3><p>{selected?.summary}</p></section>
      <section className="drawer-section"><h3>条款目录</h3>{['第一章 总则','第二章 监管要求','第三章 风险计量','第四章 监督检查','第五章 信息披露'].map((x,i)=><button className="clause-row" key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}<ChevronRight size={15}/></button>)}</section>
      <section className="drawer-section"><h3>关联知识</h3><div className="relation-grid"><span><FileBarChart/>关联报表 <b>12</b></span><span><Activity/>关联指标 <b>18</b></span><span><AlertCircle/>处罚案例 <b>46</b></span><span><CircleHelp/>条款释义 <b>23</b></span></div></section>
    </Drawer>
  </>
}

function TermsPage() {
  const [letter,setLetter]=useState('全部')
  return <><PageHeader eyebrow="GLOSSARY" title="监管术语与标准" description="统一查询监管术语的中英文名称、缩写、定义及制度出处。" />
    <FilterBar placeholder="搜索术语、英文名称、缩写或别名"><Select label="主题"><option>资本监管</option><option>流动性风险</option></Select></FilterBar>
    <div className="alphabet-bar">{['全部','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map(x=><button className={letter===x?'active':''} onClick={()=>setLetter(x)} key={x}>{x}</button>)}</div>
    <div className="terms-grid">{terms.map((item,i)=><article className="term-card" key={item.term}><div className="term-number">{String(i+1).padStart(2,'0')}</div><Badge tone="blue">{item.category}</Badge><h3>{item.term}</h3><span className="term-en">{item.en}</span><p>{item.definition}</p><footer><span><BookOpen size={14}/>{item.source}</span><ArrowRight size={15}/></footer></article>)}</div>
  </>
}

function ConstraintsPage() {
  const items=[
    {type:'禁止事项',title:'不得通过违规展期、借新还旧等方式掩盖资产质量',area:'授信管理',basis:'贷款风险分类相关制度',level:'高'},
    {type:'限制事项',title:'对单一客户或集团客户风险暴露不得超过监管比例上限',area:'集中度风险',basis:'商业银行大额风险暴露管理办法',level:'高'},
    {type:'程序要求',title:'重大关联交易应履行审议、披露和报告程序',area:'关联交易',basis:'银行保险机构关联交易管理办法',level:'中'},
    {type:'披露要求',title:'应按规定披露资本构成、风险加权资产和资本充足率信息',area:'资本监管',basis:'商业银行资本管理办法',level:'中'},
  ]
  return <><PageHeader eyebrow="COMPLIANCE CONSTRAINTS" title="业务合规约束库" description="将制度条款转化为可检索的禁止、限制、准入、报告与披露要求。" />
    <div className="mini-stats"><span><b>1,846</b>约束事项</span><span><b>286</b>禁止事项</span><span><b>642</b>限制事项</span><span><b>918</b>程序与披露</span></div>
    <FilterBar placeholder="搜索业务场景、合规要求或制度依据"><Select label="约束类型"><option>禁止事项</option><option>限制事项</option><option>程序要求</option></Select><Select label="业务领域"><option>授信管理</option><option>关联交易</option></Select></FilterBar>
    <div className="constraint-list">{items.map(x=><article key={x.title}><div className={`constraint-level ${x.level==='高'?'high':''}`}>{x.level}</div><div><Badge tone={x.level==='高'?'red':'amber'}>{x.type}</Badge><h3>{x.title}</h3><p><span>适用领域：{x.area}</span><span>制度依据：{x.basis}</span></p></div><button className="icon-button"><ChevronRight size={18}/></button></article>)}</div>
  </>
}

function FrameworkPage(){
  const levels=[{n:'L1',t:'初始级',c:'#8a9691'},{n:'L2',t:'规范级',c:'#4f86c6'},{n:'L3',t:'稳健级',c:'#2c9c73'},{n:'L4',t:'量化级',c:'#e6a33c'},{n:'L5',t:'引领级',c:'#d05e54'}]
  return <><PageHeader eyebrow="CAPABILITY FRAMEWORK" title="能力评估框架" description="以制度要求为依据，结构化呈现监管报送与数据治理能力成熟度。" actions={<button className="button ghost"><Download size={16}/>导出框架</button>} />
    <div className="framework-head"><div><h2>监管数据治理能力成熟度模型</h2><p>6 个能力域 · 24 个能力项 · 82 条评估标准</p></div><Select label="适用机构"><option>商业银行</option></Select></div>
    <div className="level-track">{levels.map((l,i)=><div key={l.n}><span style={{background:l.c}}>{l.n}</span><b>{l.t}</b><small>{['职责初步建立','制度流程成型','机制稳定运行','数据量化驱动','持续优化创新'][i]}</small></div>)}</div>
    <div className="framework-table"><div className="framework-row header"><span>能力域</span>{levels.map(x=><span key={x.n}>{x.n}</span>)}</div>{['治理架构','制度与标准','数据质量','报送管理','技术支撑','监督评价'].map((x,i)=><div className="framework-row" key={x}><span><b>{x}</b><small>{[4,5,5,4,3,3][i]} 个能力项</small></span>{levels.map((l,j)=><span key={l.n} className={j<=Math.min(4,2+(i%3===0?1:0))?'filled':''}><Check size={15}/></span>)}</div>)}</div>
  </>
}

function ReportsPage(){
  const [selected,setSelected]=useState(reports[0])
  return <><PageHeader eyebrow="REGULATORY REPORTING" title="监管报表库" description="当前为通用配置原型；正式报表体系及清单将在你提供资料后替换。" actions={<Badge tone="amber">示例数据</Badge>} />
    <div className="notice"><AlertCircle size={17}/><span>页面使用占位报表体系演示交互，不代表最终银行监管报表清单。</span></div>
    <FilterBar placeholder="搜索报表名称、代码、字段或填报口径"><Select label="报表体系"><option>监管报送体系 A</option><option>金融统计体系</option></Select><Select label="频度"><option>月报</option><option>季报</option></Select></FilterBar>
    <div className="report-layout"><section className="report-list"><div className="list-title"><span>报表任务</span><b>{reports.length}</b></div>{reports.map(r=><button key={r.code} className={selected?.code===r.code?'active':''} onClick={()=>setSelected(r)}><span className="report-code">{r.code}</span><div><b>{r.name}</b><small>{r.system} · {r.frequency}</small></div><Badge tone={r.status==='已发布'?'green':r.status==='待发布'?'amber':'neutral'}>{r.status}</Badge></button>)}</section>
      <section className="report-detail"><div className="report-title"><div><Badge tone="blue">{selected.system}</Badge><h2>{selected.name}</h2><p>{selected.code} · {selected.frequency} · 版本 {selected.version}</p></div><button className="button ghost"><Download size={16}/>下载配置</button></div>
        <div className="report-kpis"><div><small>表单</small><b>{selected.forms}</b></div><div><small>字段</small><b>{selected.fields}</b></div><div><small>校验规则</small><b>{selected.rules}</b></div><div><small>最近更新</small><b className="date-value">{selected.updated}</b></div></div>
        <div className="tabs"><button className="active">报表目录</button><button>字段字典</button><button>校验规则</button><button>版本差异</button><button>制度依据</button></div>
        <div className="table-wrap"><table><thead><tr><th>表单代码</th><th>表单名称</th><th>字段数</th><th>规则数</th><th>状态</th><th></th></tr></thead><tbody>{['资本构成情况表','风险加权资产汇总表','信用风险暴露情况表','市场风险资本要求表','操作风险资本要求表'].map((x,i)=><tr key={x}><td>A{String(i+1).padStart(2,'0')}</td><td><b>{x}（示例）</b></td><td>{[42,68,96,54,38][i]}</td><td>{[8,14,22,12,9][i]}</td><td><Badge tone="green">有效</Badge></td><td><button className="icon-button"><ChevronRight size={16}/></button></td></tr>)}</tbody></table></div>
      </section></div>
  </>
}

function MetricsPage(){
  const [selected,setSelected]=useState(null)
  return <><PageHeader eyebrow="REGULATORY METRICS" title="监管指标库" description="集中查询指标定义、公式、监管要求、报表映射及常见释疑。" actions={<button className="button ghost"><Download size={16}/>导出指标</button>} />
    <div className="metric-category-bar">{['全部指标','资本监管','流动性风险','信用风险','市场风险','操作风险','集中度风险'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}<small>{[426,82,64,96,42,58,31][i]}</small></button>)}</div>
    <FilterBar placeholder="搜索指标名称、代码、公式变量或释义"><Select label="适用机构"><option>商业银行</option></Select></FilterBar>
    <div className="metric-table table-wrap"><table><thead><tr><th>指标代码</th><th>指标名称</th><th>监管要求</th><th>计算公式</th><th>主题</th><th>释疑</th><th></th></tr></thead><tbody>{metrics.map(x=><tr key={x.code} onClick={()=>setSelected(x)}><td><code>{x.code}</code></td><td><b>{x.name}</b></td><td><Badge tone={x.value.includes('>=')?'green':'blue'}>{x.value}</Badge></td><td><span className="formula-cell">{x.formula}</span></td><td>{x.category}</td><td><span className="faq-count"><MessageSquare size={14}/>{x.faq}</span></td><td><ChevronRight size={16}/></td></tr>)}</tbody></table></div>
    <Drawer open={!!selected} onClose={()=>setSelected(null)} title={selected?.name} subtitle={`${selected?.code} · ${selected?.category}`} footer={<><button className="button ghost"><Bookmark size={16}/>收藏</button><button className="button primary"><Bot size={16}/>询问 AI</button></>}>
      <div className="metric-threshold"><span>监管要求</span><b>{selected?.value}</b><small>单位：{selected?.unit}</small></div>
      <section className="drawer-section"><h3>指标定义</h3><p>用于衡量商业银行相关风险管理与监管合规水平的核心指标，计算应采用监管认可的口径和数据范围。</p></section>
      <section className="drawer-section formula-box"><h3>计算公式</h3><code>{selected?.formula}</code></section>
      <section className="drawer-section"><h3>监管依据</h3><button className="source-link"><FileText size={16}/><span><b>{selected?.source}</b><small>点击定位相关条款</small></span><ExternalLink size={15}/></button></section>
      <section className="drawer-section"><h3>常见释疑</h3>{['分子和分母应采用哪个时点口径？','集团并表范围发生变化如何处理？','指标计算结果如何进行舍入？'].map((x,i)=><button className="faq-row" key={x}><span>{i+1}</span>{x}<ChevronRight size={15}/></button>)}</section>
    </Drawer>
  </>
}

function QualityPage(){
  const chart=[{name:'1月',v:76},{name:'2月',v:68},{name:'3月',v:72},{name:'4月',v:58},{name:'5月',v:53},{name:'6月',v:48}]
  return <><PageHeader eyebrow="DATA QUALITY" title="监管数据质量" description="沉淀数据质量问题、识别规则、影响范围和整改建议。" />
    <div className="stats-grid three"><Stat label="质量规则" value="286" meta="本月新增 12" icon={ListChecks} tone="blue"/><Stat label="高频问题" value="64" meta="高风险 18 项" icon={AlertCircle} tone="red"/><Stat label="关联报表" value="48" meta="覆盖 7 个体系" icon={FileBarChart} tone="green"/></div>
    <div className="dashboard-columns"><section className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">TREND</span><h2>问题数量趋势</h2></div><Badge tone="green">近6个月 -36.8%</Badge></div><div className="chart-space"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><CartesianGrid stroke="#e8ecea" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="v" stroke="#167a59" strokeWidth={2.5} dot={{fill:'#167a59',r:4}}/></LineChart></ResponsiveContainer></div></section>
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">TOP ISSUES</span><h2>高频问题类型</h2></div></div><div className="quality-list">{qualityIssues.map(x=><div key={x.type}><span className={`severity severity-${x.severity}`}>{x.severity}</span><b>{x.type}</b><strong>{x.count}</strong><small className={x.change.startsWith('-')?'down':''}>{x.change}</small></div>)}</div></section></div>
    <section className="panel full-panel"><div className="panel-head"><div><span className="eyebrow">RULE LIBRARY</span><h2>质量规则库</h2></div><button className="button ghost"><Download size={15}/>导出</button></div><div className="table-wrap"><table><thead><tr><th>规则代码</th><th>问题类型</th><th>识别逻辑</th><th>影响对象</th><th>严重程度</th></tr></thead><tbody>{qualityIssues.map((x,i)=><tr key={x.type}><td>DQ-{String(i+1).padStart(3,'0')}</td><td><b>{x.type}</b></td><td>{['表 A 字段 01 应等于表 B 字段 12','字段值与制度规定口径不一致','条件必填字段为空','维度成员不在有效代码范围','环比变动超过设定阈值'][i]}</td><td>{reports[i%reports.length].name}</td><td><Badge tone={x.severity==='高'?'red':x.severity==='中'?'amber':'neutral'}>{x.severity}</Badge></td></tr>)}</tbody></table></div></section>
  </>
}

function InstitutionsPage(){
  return <><PageHeader eyebrow="INSTITUTIONS" title="金融机构名单" description="查询银行业机构基本信息、机构沿革及关联处罚与披露资料。" />
    <div className="institution-types">{['全部机构','国有大型商业银行','股份制商业银行','城市商业银行','农村商业银行','外资银行'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}<small>{[4582,6,12,125,1624,41][i]}</small></button>)}</div>
    <FilterBar placeholder="搜索机构全称、简称或统一标识"><Select label="地区"><option>北京</option><option>上海</option><option>广东</option></Select><Select label="状态"><option>正常</option></Select></FilterBar>
    <div className="institution-grid">{institutions.map((x,i)=><article className="institution-card" key={x.name}><div className="institution-logo">{x.short.slice(0,2)}</div><div><Badge tone="green">{x.status}</Badge><h3>{x.name}</h3><p>{x.type} · {x.region}</p></div><div className="institution-data"><span><small>关联年报</small><b>{x.reports}</b></span><span><small>处罚案例</small><b>{x.penalties}</b></span></div><footer><button>查看机构档案</button><ArrowRight size={15}/></footer></article>)}</div>
  </>
}

function PenaltiesPage(){
  const pie=[{name:'贷款管理',value:31,color:'#167a59'},{name:'监管数据',value:24,color:'#4f86c6'},{name:'反洗钱',value:19,color:'#e6a33c'},{name:'关联交易',value:14,color:'#d05e54'},{name:'其他',value:12,color:'#8a9691'}]
  return <><PageHeader eyebrow="PENALTY ANALYTICS" title="监管处罚分析" description="检索公开处罚原文，分析机构、地区、违规行为和处罚趋势。" actions={<button className="button ghost"><Download size={16}/>导出分析</button>} />
    <div className="stats-grid"><Stat label="处罚案例" value="26,090" meta="本年 1,842" icon={FileText} tone="blue"/><Stat label="处罚金额" value="32.16 亿元" meta="平均 12.33 万元" icon={BarChart3} tone="red"/><Stat label="被处罚机构" value="2,015" meta="涉及 31 个地区" icon={Building2} tone="green"/><Stat label="责任人员" value="15,252" meta="双罚案件 4,513" icon={Users} tone="amber"/></div>
    <div className="tabs large-tabs"><button className="active">图表分析</button><button>处罚正文</button><button>违规行为</button><button>AI 分析</button></div>
    <FilterBar placeholder="搜索机构、违法事由或处罚文号"><Select label="年份"><option>2026</option><option>2025</option></Select><Select label="地区"><option>上海</option><option>北京</option></Select></FilterBar>
    <div className="analytics-grid"><section className="panel chart-panel wide"><div className="panel-head"><div><span className="eyebrow">MONTHLY TREND</span><h2>处罚数量与金额趋势</h2></div><div className="legend"><span className="green-dot">案件数</span><span className="blue-dot">金额</span></div></div><div className="chart-space"><ResponsiveContainer width="100%" height="100%"><BarChart data={penaltyTrend}><CartesianGrid stroke="#e8ecea" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="cases" fill="#167a59" radius={[3,3,0,0]}/><Line dataKey="amount" stroke="#4f86c6"/></BarChart></ResponsiveContainer></div></section>
      <section className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">VIOLATION MIX</span><h2>违规行为分布</h2></div></div><div className="pie-layout"><div className="pie-space"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} innerRadius={48} outerRadius={76} dataKey="value" paddingAngle={2}>{pie.map(x=><Cell key={x.name} fill={x.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><span><b>1,842</b><small>本年案件</small></span></div><div className="pie-legend">{pie.map(x=><div key={x.name}><i style={{background:x.color}}/><span>{x.name}</span><b>{x.value}%</b></div>)}</div></div></section></div>
    <section className="panel full-panel"><div className="panel-head"><div><span className="eyebrow">RECENT CASES</span><h2>最新处罚案例</h2></div><button className="text-button">查看全部 <ArrowRight size={14}/></button></div><div className="table-wrap"><table><thead><tr><th>处罚日期</th><th>机构</th><th>地区</th><th>违规行为</th><th>处罚措施</th><th>金额（万元）</th></tr></thead><tbody>{penalties.map(x=><tr key={x.date+x.institution}><td>{x.date}</td><td><b>{x.institution}</b><small className="block-small">{x.authority}</small></td><td>{x.region}</td><td>{x.violation}</td><td>{x.action}</td><td><strong className="amount">{x.amount}</strong></td></tr>)}</tbody></table></div></section>
  </>
}

function AnnualReportsPage(){
  const items=[['中国工商银行股份有限公司','2025年年度报告','2026-03-27','128.4 MB'],['招商银行股份有限公司','2025年年度报告','2026-03-25','86.7 MB'],['北京银行股份有限公司','2025年年度报告','2026-04-02','64.2 MB'],['上海农村商业银行股份有限公司','2025年年度报告','2026-03-30','72.1 MB']]
  return <><PageHeader eyebrow="ANNUAL REPORTS" title="年报与披露资料库" description="按机构和年度查询公开报告，并关联关键指标和原文页码。" />
    <FilterBar placeholder="搜索机构名称、报告标题或报告内容"><Select label="年度"><option>2025</option><option>2024</option></Select><Select label="报告类型"><option>年度报告</option><option>社会责任报告</option></Select></FilterBar>
    <div className="report-covers">{items.map((x,i)=><article key={x[0]}><div className={`report-cover cover-${i}`}><Landmark size={28}/><span>ANNUAL<br/>REPORT</span><b>2025</b></div><div><Badge tone="blue">年度报告</Badge><h3>{x[0]}</h3><p>{x[1]}</p><footer><span>{x[2]} · {x[3]}</span><button className="icon-button"><Download size={16}/></button></footer></div></article>)}</div>
  </>
}

function GraphPage(){
  const [active,setActive]=useState('资本充足率')
  const nodes=[{n:'资本充足率',x:50,y:48,t:'metric'},{n:'资本管理办法',x:22,y:21,t:'doc'},{n:'风险加权资产',x:77,y:20,t:'term'},{n:'资本充足情况表',x:82,y:67,t:'report'},{n:'核心一级资本',x:50,y:84,t:'term'},{n:'资本净额',x:18,y:69,t:'term'}]
  return <><PageHeader eyebrow="KNOWLEDGE GRAPH" title="知识图谱" description="探索制度、条款、报表、字段、指标、术语和处罚案例之间的关系。" />
    <div className="graph-toolbar"><label><Search size={16}/><input placeholder="搜索图谱节点" defaultValue="资本充足率"/></label><div>{['制度','指标','报表','字段','术语','处罚'].map((x,i)=><button className={`node-filter nf-${i}`} key={x}><i/>{x}</button>)}</div><button className="button ghost"><RotateCcw size={15}/>重置视图</button></div>
    <div className="graph-layout"><section className="graph-canvas"><div className="graph-grid"/><svg className="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none">{nodes.slice(1).map((n,i)=><line key={n.n} x1="50" y1="48" x2={n.x} y2={n.y} className={`line-${i%3}`}/>)}</svg>{nodes.map(n=><button key={n.n} onClick={()=>setActive(n.n)} className={`graph-node node-${n.t} ${active===n.n?'active':''}`} style={{left:`${n.x}%`,top:`${n.y}%`}}>{n.t==='doc'?<FileText/>:n.t==='report'?<FileBarChart/>:n.t==='metric'?<Activity/>:<Tags/>}<span>{n.n}</span></button>)}<div className="zoom-tools"><button>+</button><button>−</button></div></section>
      <aside className="graph-detail"><Badge tone="green">监管指标</Badge><h2>{active}</h2><p>当前节点与 18 个知识对象存在直接关系，包含制度依据、计算组成、报表映射和同类指标。</p><div className="relation-summary"><span><b>6</b>制度条款</span><span><b>4</b>报表字段</span><span><b>5</b>关联术语</span><span><b>3</b>同类指标</span></div><h3>主要关系</h3>{['依据 → 商业银行资本管理办法','计算 → 资本净额','计算 → 风险加权资产','映射 → 资本充足情况表'].map(x=><button className="relation-row" key={x}><GitBranch size={15}/>{x}<ChevronRight size={15}/></button>)}</aside></div>
  </>
}

function TopicsPage(){
  const topics=[{title:'商业银行资本新规实施观察',cat:'资本监管',desc:'梳理资本计量、风险权重与信息披露的关键变化。',docs:28,metrics:16,color:'green'},{title:'银行业监管数据质量专题',cat:'数据治理',desc:'从制度要求、高频问题和处罚案例看数据质量治理。',docs:34,metrics:12,color:'blue'},{title:'流动性风险监管指标地图',cat:'流动性风险',desc:'关联 LCR、NSFR 与相关报表字段和监管要求。',docs:18,metrics:22,color:'amber'}]
  return <><PageHeader eyebrow="RESEARCH TOPICS" title="专题研究" description="围绕重点监管主题，整合制度、指标、报表、案例与研究解读。" />
    <div className="featured-topic"><div><Badge tone="green">本月专题</Badge><h2>银行业数据治理与监管报送</h2><p>从组织架构、制度标准、数据质量到监管报送，建立完整的知识关联和实践观察。</p><div><span><FileText size={15}/>46 份制度</span><span><FileBarChart size={15}/>12 套报表</span><span><AlertCircle size={15}/>286 个案例</span></div><button className="button primary">进入专题 <ArrowRight size={15}/></button></div><div className="topic-visual"><Database/><Network/><FileCheck2/><i/><i/><i/></div></div>
    <div className="topic-grid">{topics.map(x=><article key={x.title}><div className={`topic-top topic-${x.color}`}><span>{x.cat}</span><Network size={30}/></div><div><h3>{x.title}</h3><p>{x.desc}</p><footer><span>{x.docs} 份制度</span><span>{x.metrics} 个指标</span><button><ArrowRight size={16}/></button></footer></div></article>)}</div>
  </>
}

function AIPage(){
  const [prompt,setPrompt]=useState('')
  const [messages,setMessages]=useState([
    {role:'assistant',text:'你好，我可以基于站内监管制度、报表、指标和处罚案例回答问题。你可以直接提问，也可以先指定知识范围。'}
  ])
  const send=()=>{if(!prompt.trim())return;setMessages([...messages,{role:'user',text:prompt},{role:'assistant',text:'根据站内知识，核心一级资本充足率的计算基础是核心一级资本净额与风险加权资产。正式使用时应结合机构适用范围、并表口径及当前有效制度版本。',sources:['商业银行资本管理办法 · 第三章','指标 CAP-002 · 核心一级资本充足率']}]);setPrompt('')}
  return <div className="ai-page"><aside className="chat-sidebar"><button className="button primary full"><Plus size={16}/>新建对话</button><h3>最近会话</h3>{['资本充足率口径说明','流动性报表字段差异','数据质量处罚案例','大额风险暴露限额'].map((x,i)=><button className={i===0?'active':''} key={x}><MessageSquare size={15}/><span>{x}<small>{i===0?'今天':'本周'}</small></span></button>)}<div className="chat-scope"><ShieldCheck size={17}/><span><b>站内知识模式</b><small>回答仅使用已发布知识</small></span></div></aside>
    <section className="chat-main"><div className="chat-head"><div><span className="ai-avatar"><Sparkles size={20}/></span><div><h1>AI 监管助手</h1><p>回答附带来源，可定位到原文和知识对象</p></div></div><div className="segment"><button className="active">仅站内知识</button><button>允许网络补充</button></div></div>
      <div className="chat-messages">{messages.map((m,i)=><div className={`message ${m.role}`} key={i}>{m.role==='assistant'&&<span className="message-avatar"><Bot size={18}/></span>}<div><p>{m.text}</p>{m.sources&&<div className="source-citations">{m.sources.map((s,j)=><button key={s}><span>{j+1}</span>{s}<ExternalLink size={13}/></button>)}</div>}</div></div>)}</div>
      {messages.length===1&&<div className="prompt-suggestions">{['资本充足率的监管要求是什么？','比较两个版本制度的主要变化','解释某报表字段的填报口径','分析近期数据质量处罚趋势'].map(x=><button key={x} onClick={()=>setPrompt(x)}><Sparkles size={15}/>{x}</button>)}</div>}
      <div className="chat-composer"><div className="scope-row"><button><FileText size={14}/>知识范围：全部 <ChevronDown size={13}/></button><span>AI 回答不替代正式监管判断</span></div><label><textarea rows="2" value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="输入你的问题，Shift + Enter 换行"/><button onClick={send}><ArrowRight size={18}/></button></label></div>
    </section></div>
}

function FavoritesPage(){
  return <><PageHeader eyebrow="PERSONAL CENTER" title="收藏与历史" description="集中查看收藏、订阅、浏览记录和 AI 会话。" /><div className="tabs large-tabs"><button className="active">我的收藏</button><button>我的订阅</button><button>浏览历史</button><button>AI 会话</button></div><div className="saved-list">{documents.slice(0,3).map((x,i)=><article key={x.id}><span className="saved-icon"><FileText size={20}/></span><div><Badge tone="green">制度文档</Badge><h3>{x.title}</h3><p>{x.code} · {x.agency}</p></div><span className="saved-time">{i===0?'今天收藏':`${i+2}天前收藏`}</span><button className="icon-button"><Bookmark size={17} fill="currentColor"/></button></article>)}</div></>
}

function AdminDashboard(){
  return <><PageHeader eyebrow="ADMIN CONSOLE" title="管理概览" description="维护知识资产、处理发布任务并监控平台运行状态。" actions={<button className="button primary"><Plus size={16}/>新建内容</button>} />
    <div className="admin-alert"><ShieldCheck size={20}/><div><b>当前为管理员账号</b><span>你的新增、编辑、发布、下线和权限变更操作均会记录审计日志。</span></div><button>查看日志</button></div>
    <div className="stats-grid"><Stat label="知识对象" value="62,418" meta="本周新增 286" icon={Database} tone="green"/><Stat label="待发布" value="18" meta="其中 3 项已逾期" icon={Clock3} tone="amber"/><Stat label="解析任务" value="7" meta="2 项处理中" icon={RefreshCw} tone="blue"/><Stat label="用户数" value="126" meta="管理员 4 人" icon={Users} tone="red"/></div>
    <div className="dashboard-columns"><section className="panel"><div className="panel-head"><div><span className="eyebrow">TASKS</span><h2>最近维护任务</h2></div><button className="text-button">全部任务 <ArrowRight size={14}/></button></div><div className="task-list">{adminTasks.map(x=><div key={x.title}><span className={`task-state ts-${x.status}`}>{x.status}</span><div><b>{x.title}</b><small>{x.type} · {x.owner} · {x.time}</small><i><em style={{width:`${x.progress}%`}}/></i></div><strong>{x.progress}%</strong></div>)}</div></section>
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">CONTENT HEALTH</span><h2>内容健康度</h2></div><Badge tone="green">良好</Badge></div><div className="health-score"><div><b>92</b><small>/ 100</small></div><span>较上月 +3</span></div><div className="health-list"><div><span>来源完整率</span><i><em style={{width:'98%'}}/></i><b>98%</b></div><div><span>按期复核率</span><i><em style={{width:'91%'}}/></i><b>91%</b></div><div><span>关系完整率</span><i><em style={{width:'86%'}}/></i><b>86%</b></div></div></section></div>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">QUICK ACTIONS</span><h2>快捷维护</h2></div></div><div className="quick-actions">{[[Upload,'上传制度文档','支持 PDF、Word、Excel'],[FileBarChart,'配置监管报表','维护报表、字段和规则'],[Activity,'新增监管指标','配置公式与指标释疑'],[FileCheck2,'发布内容','查看待发布与版本差异']].map(([I,t,d])=><button key={t}><I size={22}/><span><b>{t}</b><small>{d}</small></span><ArrowRight size={16}/></button>)}</div></section>
  </>
}

function AdminDocuments(){
  const [upload,setUpload]=useState(false)
  return <><PageHeader eyebrow="CONTENT MANAGEMENT" title="知识文档管理" description="上传、解析、编辑、发布和维护监管制度及附件。" actions={<><button className="button ghost"><Download size={16}/>导入模板</button><button className="button primary" onClick={()=>setUpload(true)}><Upload size={16}/>上传文档</button></>} />
    <div className="admin-tabs"><button className="active">全部文档 <span>3,284</span></button><button>草稿 <span>26</span></button><button>解析中 <span>7</span></button><button>待发布 <span>12</span></button><button>已发布 <span>3,214</span></button><button>已下线 <span>25</span></button></div>
    <FilterBar placeholder="搜索文档名称、文号或来源"><Select label="状态"><option>草稿</option><option>已发布</option></Select><button className="button ghost"><RefreshCw size={15}/>刷新</button></FilterBar>
    <div className="table-wrap admin-table"><table><thead><tr><th><input type="checkbox"/></th><th>文档名称</th><th>业务主题</th><th>状态</th><th>版本</th><th>更新时间</th><th>更新人</th><th>操作</th></tr></thead><tbody>{documents.map((x,i)=><tr key={x.id}><td><input type="checkbox"/></td><td><b>{x.title}</b><small className="block-small">{x.code}</small></td><td>{x.topic}</td><td><Badge tone={i===4?'amber':'green'}>{i===4?'待发布':'已发布'}</Badge></td><td>V{2+i}.0</td><td>2026-10-{String(14-i).padStart(2,'0')}</td><td>管理员</td><td><div className="row-actions"><button title="编辑"><Edit3 size={15}/></button><button title="历史"><History size={15}/></button><button title="更多"><ChevronDown size={15}/></button></div></td></tr>)}</tbody></table></div>
    <Drawer open={upload} onClose={()=>setUpload(false)} title="上传制度文档" subtitle="上传后系统将自动解析正文、目录、表格和附件" footer={<><button className="button ghost" onClick={()=>setUpload(false)}>取消</button><button className="button primary" onClick={()=>setUpload(false)}><Upload size={16}/>开始上传</button></>}>
      <div className="upload-zone"><Upload size={28}/><b>拖放文件到此处，或点击选择文件</b><span>支持 PDF、DOCX、XLSX、HTML、TXT 和图片，单个文件不超过 100 MB</span><button className="button ghost">选择文件</button></div>
      <div className="form-grid"><label><span>业务主题 *</span><select><option>请选择</option><option>资本监管</option><option>数据治理</option></select></label><label><span>效力状态 *</span><select><option>现行有效</option><option>即将生效</option></select></label><label className="full"><span>来源 URL</span><input placeholder="https://..."/></label><label className="full"><span>备注</span><textarea rows="3" placeholder="填写版本、附件或处理说明"/></label></div>
    </Drawer>
  </>
}

function AdminReports(){
  const [selected,setSelected]=useState(reports[1])
  return <><PageHeader eyebrow="REPORT CONFIGURATION" title="报表配置中心" description="配置报表体系、任务版本、表单、字段、维度和校验规则。" actions={<><button className="button ghost"><Upload size={16}/>批量导入</button><button className="button primary"><Plus size={16}/>新建报表任务</button></>} />
    <div className="notice"><AlertCircle size={17}/><span>等待业务方提供正式银行报表类型和清单后，将在此完成首批配置。</span></div>
    <div className="config-layout"><aside className="config-tree"><div className="tree-head"><b>报表体系</b><button className="icon-button"><Plus size={16}/></button></div>{['监管报送体系 A','监管报送体系 B','金融统计体系','客户风险监测体系'].map((x,i)=><div key={x}><button className={i===1?'active':''}><ChevronDown size={15}/><FileBarChart size={16}/>{x}<small>{[12,8,24,16][i]}</small></button>{i===1&&<div className="tree-children">{reports.slice(0,3).map(r=><button key={r.code} onClick={()=>setSelected(r)} className={selected.code===r.code?'active':''}>{r.name}</button>)}</div>}</div>)}</aside>
      <section className="config-main"><div className="config-head"><div><Badge tone="amber">{selected.status}</Badge><h2>{selected.name}</h2><p>{selected.code} · {selected.system} · 版本 {selected.version}</p></div><div><button className="button ghost"><History size={15}/>版本</button><button className="button primary"><FileCheck2 size={15}/>发布</button></div></div>
        <div className="config-steps">{['基本信息','表单配置','字段配置','维度代码','校验规则','关联关系','预览发布'].map((x,i)=><button className={i===2?'active':i<2?'done':''} key={x}><span>{i<2?<Check size={14}/>:i+1}</span>{x}</button>)}</div>
        <div className="config-toolbar"><label><Search size={15}/><input placeholder="搜索字段代码或名称"/></label><button className="button ghost"><Upload size={15}/>导入字段</button><button className="button primary"><Plus size={15}/>新增字段</button></div>
        <div className="table-wrap"><table><thead><tr><th>序号</th><th>字段代码</th><th>字段名称</th><th>数据类型</th><th>单位</th><th>必填</th><th>关联指标</th><th>操作</th></tr></thead><tbody>{['核心一级资本净额','一级资本净额','资本净额','风险加权资产','资本充足率'].map((x,i)=><tr key={x}><td>{i+1}</td><td><code>F{String(i+1).padStart(4,'0')}</code></td><td><b>{x}</b></td><td>{i===4?'百分比':'数值'}</td><td>{i===4?'%':'万元'}</td><td><Check size={15} className="check-icon"/></td><td>{i===4?<Badge tone="green">CAP-001</Badge>:'—'}</td><td><div className="row-actions"><button><Edit3 size={15}/></button><button><ChevronDown size={15}/></button></div></td></tr>)}</tbody></table></div>
      </section></div>
  </>
}

function AdminMetrics(){
  return <><PageHeader eyebrow="METRIC MANAGEMENT" title="指标与释疑" description="维护指标定义、公式、变量、监管要求、报表映射和常见问题。" actions={<><button className="button ghost"><Upload size={16}/>批量导入</button><button className="button primary"><Plus size={16}/>新增指标</button></>} />
    <div className="admin-tabs"><button className="active">全部指标 <span>426</span></button><button>草稿 <span>9</span></button><button>待发布 <span>6</span></button><button>已发布 <span>411</span></button></div>
    <FilterBar placeholder="搜索指标名称、代码或公式变量"><Select label="指标主题"><option>资本监管</option><option>流动性风险</option></Select></FilterBar>
    <div className="metric-table table-wrap admin-table"><table><thead><tr><th>指标代码</th><th>指标名称</th><th>监管要求</th><th>公式状态</th><th>字段映射</th><th>释疑</th><th>状态</th><th>操作</th></tr></thead><tbody>{metrics.map((x,i)=><tr key={x.code}><td><code>{x.code}</code></td><td><b>{x.name}</b><small className="block-small">{x.category}</small></td><td>{x.value}</td><td><Badge tone="green"><Check size={12}/>已配置</Badge></td><td>{3+i} 个字段</td><td>{x.faq} 条</td><td><Badge tone={i===4?'amber':'green'}>{i===4?'待发布':'已发布'}</Badge></td><td><div className="row-actions"><button><Edit3 size={15}/></button><button><History size={15}/></button></div></td></tr>)}</tbody></table></div>
  </>
}

function AdminPublish(){
  const items=[...documents.slice(0,2).map((x,i)=>({name:x.title,type:'制度文档',version:`V${3+i}.0`,change:'更新条款结构及关联指标',time:`2026-10-${14-i}`,risk:i===0?'高':'中'})),{name:'监管报送体系 B 2026.2',type:'报表版本',version:'V2026.2',change:'新增 18 个字段、调整 6 条校验规则',time:'2026-10-12',risk:'高'},{name:'流动性覆盖率释疑',type:'指标释疑',version:'V1.3',change:'补充现金流出分类边界说明',time:'2026-10-11',risk:'低'}]
  return <><PageHeader eyebrow="PUBLISH CENTER" title="内容发布中心" description="查看待发布内容、版本差异，并执行发布、定时发布和下线。" actions={<button className="button primary"><FileCheck2 size={16}/>批量发布</button>} />
    <div className="publish-summary"><div><b>18</b><span>待发布</span></div><div><b>3</b><span>高影响变更</span></div><div><b>5</b><span>计划今日发布</span></div><div><b>42</b><span>本月已发布</span></div></div>
    <div className="admin-tabs"><button className="active">待发布 <span>18</span></button><button>定时发布 <span>4</span></button><button>发布记录 <span>286</span></button><button>已下线 <span>25</span></button></div>
    <div className="publish-list">{items.map(x=><article key={x.name}><input type="checkbox"/><span className="publish-icon">{x.type==='制度文档'?<FileText/>:x.type==='报表版本'?<FileBarChart/>:<Activity/>}</span><div><div><Badge tone={x.risk==='高'?'red':x.risk==='中'?'amber':'neutral'}>{x.risk}影响</Badge><span>{x.type}</span></div><h3>{x.name}</h3><p>{x.version} · {x.change}</p></div><span className="publish-time"><small>提交时间</small>{x.time}</span><div className="publish-actions"><button className="button ghost">查看差异</button><button className="button primary">发布</button></div></article>)}</div>
  </>
}

function AdminUsers(){
  const users=[['张明','zhangming@bank.local','管理员','风险管理部','正常','今天 09:18'],['李静','lijing@bank.local','普通用户','合规管理部','正常','昨天 16:42'],['王晨','wangchen@bank.local','普通用户','财务会计部','正常','10月12日'],['陈宇','chenyu@bank.local','管理员','数据管理部','正常','10月11日'],['周敏','zhoumin@bank.local','普通用户','内部审计部','已停用','9月28日']]
  return <><PageHeader eyebrow="USER MANAGEMENT" title="用户管理" description="平台仅设置管理员和普通用户两类角色。" actions={<><button className="button ghost"><Upload size={16}/>批量导入</button><button className="button primary"><Plus size={16}/>新增用户</button></>} />
    <div className="stats-grid three"><Stat label="全部用户" value="126" meta="本月新增 8" icon={Users} tone="blue"/><Stat label="管理员" value="4" meta="统一后台权限" icon={UserCog} tone="red"/><Stat label="普通用户" value="122" meta="仅查询已发布内容" icon={Search} tone="green"/></div>
    <FilterBar placeholder="搜索姓名、邮箱或部门"><Select label="角色"><option>管理员</option><option>普通用户</option></Select><Select label="状态"><option>正常</option><option>已停用</option></Select></FilterBar>
    <div className="table-wrap admin-table"><table><thead><tr><th>用户</th><th>部门</th><th>角色</th><th>状态</th><th>最后登录</th><th>操作</th></tr></thead><tbody>{users.map((x,i)=><tr key={x[1]}><td><div className="user-cell"><span>{x[0].slice(-1)}</span><div><b>{x[0]}</b><small>{x[1]}</small></div></div></td><td>{x[3]}</td><td><Badge tone={x[2]==='管理员'?'red':'blue'}>{x[2]}</Badge></td><td><Badge tone={x[4]==='正常'?'green':'neutral'}>{x[4]}</Badge></td><td>{x[5]}</td><td><div className="row-actions"><button><Edit3 size={15}/></button><button><ChevronDown size={15}/></button></div></td></tr>)}</tbody></table></div>
  </>
}

function AdminSettings(){
  const groups=[{icon:Tags,title:'基础字典',desc:'发布机构、制度层级、业务主题、机构类型、频度与单位',count:'18 类字典'},{icon:Search,title:'搜索配置',desc:'同义词、停用词、搜索提升词和热门搜索',count:'286 条规则'},{icon:LockKeyhole,title:'安全策略',desc:'登录策略、会话超时、文件限制与多因素认证',count:'12 项配置'},{icon:Database,title:'任务与存储',desc:'解析、OCR、索引、导入导出任务和对象存储',count:'7 个任务'},{icon:Bot,title:'AI 配置',desc:'知识范围、模型参数、提示词与引用规则',count:'5 项配置'},{icon:History,title:'审计日志',desc:'查看登录、编辑、发布、回滚和用户变更记录',count:'12,486 条'}]
  return <><PageHeader eyebrow="SYSTEM SETTINGS" title="系统配置" description="管理平台基础字典、搜索、安全、任务、AI 和审计设置。" />
    <div className="settings-grid">{groups.map(g=><button key={g.title}><span className="settings-icon"><g.icon size={21}/></span><div><h3>{g.title}</h3><p>{g.desc}</p><small>{g.count}</small></div><ChevronRight size={17}/></button>)}</div>
    <section className="panel full-panel"><div className="panel-head"><div><span className="eyebrow">PLATFORM INFO</span><h2>平台信息</h2></div></div><div className="settings-form"><label><span>平台名称</span><input defaultValue="银规智库"/></label><label><span>默认语言</span><select><option>简体中文</option></select></label><label><span>内容复核提醒</span><select><option>到期前 7 天</option></select></label><label><span>默认可见范围</span><select><option>全体用户可见</option><option>仅管理员可见</option></select></label></div><div className="panel-actions"><button className="button primary">保存设置</button></div></section>
  </>
}

function Placeholder({type}){
  const map={annual:['年报与披露资料库','AnnualReportsPage'],topics:['专题研究','TopicsPage']}
  return <EmptyNote title={map[type]?.[0]||'功能页面'} text="原型页面正在整理中"/>
}

export default function App(){
  return <AppShell><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/search" element={<SearchPage/>}/>
    <Route path="/knowledge/docs" element={<DocumentsPage/>}/>
    <Route path="/knowledge/terms" element={<TermsPage/>}/>
    <Route path="/knowledge/constraints" element={<ConstraintsPage/>}/>
    <Route path="/knowledge/frameworks" element={<FrameworkPage/>}/>
    <Route path="/regulatory/reports" element={<ReportsPage/>}/>
    <Route path="/regulatory/metrics" element={<MetricsPage/>}/>
    <Route path="/regulatory/quality" element={<QualityPage/>}/>
    <Route path="/regulatory/institutions" element={<InstitutionsPage/>}/>
    <Route path="/analysis/penalties" element={<PenaltiesPage/>}/>
    <Route path="/analysis/annual-reports" element={<AnnualReportsPage/>}/>
    <Route path="/analysis/graph" element={<GraphPage/>}/>
    <Route path="/analysis/topics" element={<TopicsPage/>}/>
    <Route path="/ai" element={<AIPage/>}/>
    <Route path="/favorites" element={<FavoritesPage/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/admin/documents" element={<AdminDocuments/>}/>
    <Route path="/admin/reports" element={<AdminReports/>}/>
    <Route path="/admin/metrics" element={<AdminMetrics/>}/>
    <Route path="/admin/publish" element={<AdminPublish/>}/>
    <Route path="/admin/users" element={<AdminUsers/>}/>
    <Route path="/admin/settings" element={<AdminSettings/>}/>
    <Route path="*" element={<HomePage/>}/>
  </Routes></AppShell>
}
