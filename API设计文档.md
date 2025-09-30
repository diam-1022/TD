# 项目目标 API 设计文档

## 概述

本文档定义了项目目标管理系统的后端 API 接口规范。系统基于 Vue 3 前端，需要提供完整的 RESTful API 支持。

## 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS
- **后端**: ？
- **数据库**: PostgreSQL（？
- **认证**: JWT Token
- **文件存储**: 本地存储/云存储

## 基础配置

### 基础 URL
```
开发环境: http://localhost:3000/api
生产环境: https://api.yourdomain.com/api
```

### 认证方式
所有需要认证的接口都需要在请求头中包含 JWT Token：
```
Authorization: Bearer <token>
```

### 响应格式
所有 API 响应都遵循统一格式：

**成功响应**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 分页格式
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## 1. 用户认证 API

### 1.1 用户注册
```http
POST /auth/register
```

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_string"
  }
}
```

### 1.2 用户登录
```http
POST /auth/login
```

**请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string"
    },
    "token": "jwt_token_string"
  }
}
```

### 1.3 获取当前用户信息
```http
GET /auth/me
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 1.4 更新用户信息
```http
PUT /auth/profile
```

**请求体**:
```json
{
  "username": "string",
  "avatar": "string"
}
```

### 1.5 修改密码
```http
PUT /auth/password
```

**请求体**:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

## 2. 任务管理 API

### 2.1 获取任务列表
```http
GET /tasks?page=1&limit=20&status=all&priority=all&assignee=all
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 任务状态 (all, pending, in_progress, completed)
- `priority`: 优先级 (all, vital, routine, fun)
- `assignee`: 负责人 (all, me, user_id)

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "status": "pending|in_progress|completed",
        "priority": "vital|routine|fun",
        "progress": 0,
        "assignee": {
          "id": "string",
          "username": "string",
          "avatar": "string"
        },
        "assignees": [],
        "deadline": "2024-01-01T00:00:00.000Z",
        "tags": ["string"],
        "subtasks": [
          {
            "id": "string",
            "title": "string",
            "completed": false
          }
        ],
        "attachments": [],
        "groupId": "string",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

### 2.2 创建任务
```http
POST /tasks
```

**请求体**:
```json
{
  "title": "string",
  "description": "string",
  "priority": "vital|routine|fun",
  "assignee": "string",
  "assignees": ["string"],
  "deadline": "2024-01-01T00:00:00.000Z",
  "tags": ["string"],
  "subtasks": [
    {
      "title": "string"
    }
  ],
  "groupId": "string"
}
```

### 2.3 获取任务详情
```http
GET /tasks/:id
```

### 2.4 更新任务
```http
PUT /tasks/:id
```

**请求体**:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in_progress|completed",
  "priority": "vital|routine|fun",
  "progress": 0,
  "assignee": "string",
  "assignees": ["string"],
  "deadline": "2024-01-01T00:00:00.000Z",
  "tags": ["string"],
  "subtasks": [
    {
      "id": "string",
      "title": "string",
      "completed": false
    }
  ]
}
```

### 2.5 删除任务
```http
DELETE /tasks/:id
```

### 2.6 更新任务状态
```http
PATCH /tasks/:id/status
```

**请求体**:
```json
{
  "status": "pending|in_progress|completed",
  "progress": 0
}
```

### 2.7 更新子任务状态
```http
PATCH /tasks/:id/subtasks/:subtaskId
```

**请求体**:
```json
{
  "completed": true
}
```

## 3. 日程管理 API

### 3.1 获取日程列表
```http
GET /schedules?page=1&limit=20&date=2024-01-01&status=all
```

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `date`: 日期 (YYYY-MM-DD)
- `status`: 状态筛选
- `priority`: 优先级筛选

### 3.2 创建日程
```http
POST /schedules
```

**请求体**:
```json
{
  "title": "string",
  "description": "string",
  "platform": "string",
  "deadline": "2024-01-01T00:00:00.000Z",
  "priority": "vital|routine|fun",
  "tags": ["string"],
  "assignee": "string",
  "assignees": ["string"],
  "groupId": "string"
}
```

### 3.3 获取日程详情
```http
GET /schedules/:id
```

### 3.4 更新日程
```http
PUT /schedules/:id
```

### 3.5 删除日程
```http
DELETE /schedules/:id
```

### 3.6 设置日程提醒
```http
POST /schedules/:id/reminders
```

**请求体**:
```json
{
  "type": "1hour|1day|3days|custom",
  "customDays": 0,
  "customHours": 0
}
```

### 3.7 获取日程提醒
```http
GET /schedules/:id/reminders
```

### 3.8 删除日程提醒
```http
DELETE /schedules/:id/reminders/:reminderId
```

## 4. 群组协作 API

### 4.1 获取群组列表
```http
GET /groups?page=1&limit=20
```

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "avatar": "string",
        "memberCount": 0,
        "taskCount": 0,
        "role": "admin|editor|viewer|restricted",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

### 4.2 创建群组
```http
POST /groups
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "avatar": "string"
}
```

### 4.3 获取群组详情
```http
GET /groups/:id
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "avatar": "string",
    "memberCount": 0,
    "taskCount": 0,
    "scheduleCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "members": [
      {
        "id": "string",
        "username": "string",
        "email": "string",
        "avatar": "string",
        "role": "admin|editor|viewer|restricted",
        "status": "active|pending|inactive",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 4.4 更新群组信息
```http
PUT /groups/:id
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "avatar": "string"
}
```

### 4.5 删除群组
```http
DELETE /groups/:id
```

### 4.6 获取群组成员
```http
GET /groups/:id/members
```

### 4.7 邀请成员
```http
POST /groups/:id/members/invite
```

**请求体**:
```json
{
  "userIdentifier": "string",
  "role": "admin|editor|viewer|restricted",
  "message": "string"
}
```

### 4.8 更新成员角色
```http
PUT /groups/:id/members/:userId
```

**请求体**:
```json
{
  "role": "admin|editor|viewer|restricted"
}
```

### 4.9 移除成员
```http
DELETE /groups/:id/members/:userId
```

### 4.10 获取群组任务
```http
GET /groups/:id/tasks?page=1&limit=20
```

### 4.11 获取群组日程
```http
GET /groups/:id/schedules?page=1&limit=20
```

## 5. 文件管理 API

### 5.1 上传文件
```http
POST /files/upload
```

**请求体**: multipart/form-data
- `file`: 文件
- `groupId`: 群组ID (可选)

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "filename": "string",
    "originalName": "string",
    "size": 0,
    "mimeType": "string",
    "url": "string",
    "groupId": "string",
    "uploadedBy": "string",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5.2 获取文件列表
```http
GET /files?page=1&limit=20&groupId=string
```

### 5.3 获取文件详情
```http
GET /files/:id
```

### 5.4 下载文件
```http
GET /files/:id/download
```

### 5.5 删除文件
```http
DELETE /files/:id
```

## 6. 通知系统 API

### 6.1 获取通知列表
```http
GET /notifications?page=1&limit=20&unreadOnly=false
```

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `unreadOnly`: 仅未读通知

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "type": "reminder|urgent|success|info",
        "title": "string",
        "message": "string",
        "read": false,
        "data": {},
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {},
    "unreadCount": 0
  }
}
```

### 6.2 标记通知为已读
```http
PATCH /notifications/:id/read
```

### 6.3 标记所有通知为已读
```http
PATCH /notifications/read-all
```

### 6.4 删除通知
```http
DELETE /notifications/:id
```

### 6.5 获取未读通知数量
```http
GET /notifications/unread-count
```

**响应**:
```json
{
  "success": true,
  "data": {
    "count": 0
  }
}
```

## 7. 统计和报表 API

### 7.1 获取仪表板数据
```http
GET /dashboard/stats
```

**响应**:
```json
{
  "success": true,
  "data": {
    "taskStats": {
      "total": 0,
      "completed": 0,
      "pending": 0,
      "inProgress": 0
    },
    "scheduleStats": {
      "total": 0,
      "upcoming": 0,
      "overdue": 0
    },
    "groupStats": {
      "total": 0,
      "active": 0
    },
    "performanceData": {
      "completionRate": 0,
      "averageCompletionTime": 0,
      "productivityScore": 0
    }
  }
}
```

### 7.2 获取任务完成趋势
```http
GET /dashboard/task-trends?period=7d
```

**查询参数**:
- `period`: 时间周期 (7d, 30d, 90d)

### 7.3 获取优先级分布
```http
GET /dashboard/priority-distribution
```

### 7.4 获取群组活跃度
```http
GET /dashboard/group-activity
```

## 8. 搜索 API

### 8.1 全局搜索
```http
GET /search?q=keyword&type=all&page=1&limit=20
```

**查询参数**:
- `q`: 搜索关键词
- `type`: 搜索类型 (all, tasks, schedules, groups, files)
- `page`: 页码
- `limit`: 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "tasks": [],
    "schedules": [],
    "groups": [],
    "files": [],
    "pagination": {}
  }
}
```

## 错误码定义

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| AUTH_001 | 401 | 未授权访问 |
| AUTH_002 | 401 | Token已过期 |
| AUTH_003 | 401 | Token无效 |
| AUTH_004 | 400 | 用户名或密码错误 |
| AUTH_005 | 400 | 用户已存在 |
| VALIDATION_001 | 400 | 请求参数验证失败 |
| NOT_FOUND_001 | 404 | 资源不存在 |
| PERMISSION_001 | 403 | 权限不足 |
| SERVER_001 | 500 | 服务器内部错误 |

## 数据模型

### 用户模型 (User)
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "avatar": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 任务模型 (Task)
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "pending|in_progress|completed",
  "priority": "vital|routine|fun",
  "progress": 0,
  "assignee": "string",
  "assignees": ["string"],
  "deadline": "2024-01-01T00:00:00.000Z",
  "tags": ["string"],
  "subtasks": [
    {
      "id": "string",
      "title": "string",
      "completed": false
    }
  ],
  "attachments": ["string"],
  "groupId": "string",
  "createdBy": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 日程模型 (Schedule)
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "platform": "string",
  "deadline": "2024-01-01T00:00:00.000Z",
  "priority": "vital|routine|fun",
  "tags": ["string"],
  "assignee": "string",
  "assignees": ["string"],
  "groupId": "string",
  "reminders": [
    {
      "id": "string",
      "type": "1hour|1day|3days|custom",
      "customDays": 0,
      "customHours": 0,
      "reminderTime": "2024-01-01T00:00:00.000Z"
    }
  ],
  "createdBy": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 群组模型 (Group)
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "avatar": "string",
  "createdBy": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 群组成员模型 (GroupMember)
```json
{
  "id": "string",
  "groupId": "string",
  "userId": "string",
  "role": "admin|editor|viewer|restricted",
  "status": "active|pending|inactive",
  "joinedAt": "2024-01-01T00:00:00.000Z"
}
```

### 通知模型 (Notification)
```json
{
  "id": "string",
  "userId": "string",
  "type": "reminder|urgent|success|info",
  "title": "string",
  "message": "string",
  "read": false,
  "data": {},
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 文件模型 (File)
```json
{
  "id": "string",
  "filename": "string",
  "originalName": "string",
  "size": 0,
  "mimeType": "string",
  "url": "string",
  "groupId": "string",
  "uploadedBy": "string",
  "uploadedAt": "2024-01-01T00:00:00.000Z"
}
```

## 部署和配置

### 环境变量
```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_goals
DB_USER=username
DB_PASSWORD=password

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# 邮件配置 (用于通知)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

### Docker 配置
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 安全考虑

1. **认证和授权**: 使用 JWT Token 进行用户认证
2. **输入验证**: 对所有输入数据进行验证和清理
3. **SQL注入防护**: 使用参数化查询
4. **XSS防护**: 对输出数据进行转义
5. **CSRF防护**: 使用CSRF Token
6. **文件上传安全**: 限制文件类型和大小
7. **速率限制**: 实现API调用频率限制
8. **HTTPS**: 生产环境使用HTTPS

## 性能优化

1. **数据库索引**: 为常用查询字段创建索引
2. **缓存策略**: 使用Redis缓存热点数据
3. **分页查询**: 所有列表接口都支持分页
4. **文件压缩**: 启用Gzip压缩
5. **CDN**: 静态文件使用CDN加速

## 监控和日志

1. **错误监控**: 集成错误监控服务
2. **性能监控**: 监控API响应时间
3. **访问日志**: 记录所有API访问
4. **业务日志**: 记录重要业务操作

## 版本控制

API版本通过URL路径控制：
- v1: `/api/v1/`
- v2: `/api/v2/`

向后兼容性保证至少2个版本。

## 测试

### 单元测试
- 使用Jest进行单元测试
- 测试覆盖率要求 > 80%

### 集成测试
- 使用Supertest进行API集成测试
- 测试所有API端点

### 性能测试
- 使用Artillery进行负载测试
- 确保API响应时间 < 200ms

---

*本文档版本: v1.0*  
*最后更新: 2024-01-01*  
*维护者: 开发团队*
