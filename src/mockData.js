const mockData = {
  "task_001": {
    "user_name": "张伟",
    "task_title": "电商平台后台重构",
    "mount_directory_path": "/home/zhangwei/projects/ecommerce-admin",
    "source": "vscode",
    "queries": [
      {
        "query_id": "q_001",
        "query": "帮我把这个 React class 组件重构成函数组件，使用 hooks",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 3420,
        "error_message": null
      },
      {
        "query_id": "q_002",
        "query": "这个接口返回的数据结构怎么用 TypeScript 定义类型？\n\n```json\n{\n  \"code\": 0,\n  \"data\": { \"list\": [], \"total\": 100 }\n}\n```",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 1850,
        "error_message": null
      },
      {
        "query_id": "q_003",
        "query": "帮我写一个防抖 hook，延迟 300ms",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": 980,
        "error_message": null
      },
      {
        "query_id": "q_004",
        "query": "解释一下这段代码为什么会导致 useEffect 死循环",
        "status": "cancelled",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": null,
        "error_message": null
      }
    ]
  },
  "task_002": {
    "user_name": "张伟",
    "task_title": "性能优化专项",
    "mount_directory_path": "/home/zhangwei/projects/ecommerce-admin",
    "source": "vscode",
    "queries": [
      {
        "query_id": "q_005",
        "query": "我的列表页有 10000 条数据渲染很慢，怎么做虚拟滚动？",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 5210,
        "error_message": null
      },
      {
        "query_id": "q_006",
        "query": "bundle 分析后发现 moment.js 太大了，怎么替换成 dayjs？",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": 2340,
        "error_message": null
      }
    ]
  },
  "task_003": {
    "user_name": "李娜",
    "task_title": "用户权限模块开发",
    "mount_directory_path": "/workspace/auth-service",
    "source": "cursor",
    "queries": [
      {
        "query_id": "q_007",
        "query": "帮我设计一个 RBAC 权限系统的数据库表结构",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 4100,
        "error_message": null
      },
      {
        "query_id": "q_008",
        "query": "JWT token 过期后怎么做无感刷新？前端怎么拦截 401 自动续签？",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 3780,
        "error_message": null
      },
      {
        "query_id": "q_009",
        "query": "这段 SQL 查询用户权限列表的语句能帮我优化一下吗，现在慢查询了\n\nSELECT u.*, r.name as role_name FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.status = 1",
        "status": "error",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 120,
        "error_message": "context length exceeded: input tokens (32841) exceed model limit (32768)"
      }
    ]
  },
  "task_004": {
    "user_name": "李娜",
    "task_title": "单元测试补全",
    "mount_directory_path": "/workspace/auth-service",
    "source": "cursor",
    "queries": [
      {
        "query_id": "q_010",
        "query": "帮我给这个 login service 写 Jest 单元测试，需要 mock axios",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": 6200,
        "error_message": null
      },
      {
        "query_id": "q_011",
        "query": "测试覆盖率报告怎么看，哪些分支没有被覆盖到？",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": 1560,
        "error_message": null
      }
    ]
  },
  "task_005": {
    "user_name": "王博",
    "task_title": "数据可视化大屏",
    "mount_directory_path": "/Users/wangbo/Desktop/dashboard",
    "source": "windsurf",
    "queries": [
      {
        "query_id": "q_012",
        "query": "用 ECharts 实现一个实时更新的折线图，数据每秒刷新一次",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 4890,
        "error_message": null
      },
      {
        "query_id": "q_013",
        "query": "大屏适配不同分辨率的方案有哪些？rem、vw、scale transform 各有什么优缺点",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 2670,
        "error_message": null
      },
      {
        "query_id": "q_014",
        "query": "帮我写一个 WebSocket 连接管理器，支持断线重连",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 5340,
        "error_message": null
      },
      {
        "query_id": "q_015",
        "query": "地图组件加载失败，报错 Cannot read properties of undefined",
        "status": "error",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 890,
        "error_message": "network timeout: upstream service unavailable after 3 retries"
      },
      {
        "query_id": "q_016",
        "query": "CSS 动画实现数字滚动效果，从旧数值过渡到新数值",
        "status": "cancelled",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": null,
        "error_message": null
      }
    ]
  },
  "task_006": {
    "user_name": "陈晓明",
    "task_title": "API 网关接入",
    "mount_directory_path": "/opt/services/gateway",
    "source": "vscode",
    "queries": [
      {
        "query_id": "q_017",
        "query": "Nginx 配置反向代理，把 /api/* 转发到后端服务，同时处理跨域",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 2100,
        "error_message": null
      },
      {
        "query_id": "q_018",
        "query": "接口限流怎么实现？Redis + 滑动窗口算法的代码示例",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-turbo",
        "duration_ms": 3900,
        "error_message": null
      },
      {
        "query_id": "q_019",
        "query": "帮我写 OpenAPI 3.0 的 YAML 文档，描述这个用户登录接口",
        "status": "completed",
        "baidu_cc_model": "ernie-4.5-8k",
        "duration_ms": 2450,
        "error_message": null
      }
    ]
  }
};

export default mockData;
