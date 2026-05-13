<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/apis/user'
import { AppError } from '@/utils/errors'

const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const isLoading = ref(false)

const form = reactive({
  id: '',
  username: '',
  email: '',
  phone: '',
  nickname: '',
  role: '',
  createdAt: '',
})

const submitForm = computed(() => {
  const data: Record<string, string | undefined> = {}
  if (form.email) data.email = form.email
  if (form.phone) data.phone = form.phone
  if (form.nickname) data.nickname = form.nickname
  return data
})

const rules = reactive<FormRules>({
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  nickname: [{ min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
})

onMounted(async () => {
  if (!authStore.user) {
    await authStore.getMe()
  }
  if (authStore.user) {
    form.id = authStore.user.id
    form.username = authStore.user.username
    form.email = authStore.user.email
    form.phone = authStore.user.phone || ''
    form.nickname = authStore.user.nickname || ''
    form.role = authStore.user.role
    form.createdAt = new Date(authStore.user.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
})

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    isLoading.value = true
    try {
      await userApi.updateUser(submitForm.value)
      await authStore.getMe()
      ElMessage.success('保存成功')
    } catch (error) {
      if (error instanceof AppError) {
        ElMessage.error(error.message)
      } else {
        ElMessage.error('保存失败，请稍后重试')
      }
    } finally {
      isLoading.value = false
    }
  })
}
</script>

<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1 class="settings-title">个人设置</h1>
      <p class="settings-desc">管理您的账户信息和偏好设置</p>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <div class="user-card">
          <el-avatar class="avatar" :size="80">{{
            authStore.user?.nickname?.[0] || authStore.user?.username?.[0] || '用户'
          }}</el-avatar>
          <div class="username">{{ authStore.user?.nickname || authStore.user?.username || '用户' }}</div>
          <div class="user-role">
            {{
              authStore.user?.role === 'admin' ? '管理员' : '普通用户'
            }}
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
            基本信息
          </div>
        </nav>
      </div>

      <div class="settings-main">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="settings-form"
        >
          <div class="form-section">
            <h2 class="section-title">公开资料</h2>
            <p class="section-desc">此信息将显示在您的个人资料页面上</p>

            <div class="form-grid">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" disabled />
              </el-form-item>

              <el-form-item label="用户ID" prop="id">
                <el-input v-model="form.id" disabled />
              </el-form-item>

              <el-form-item label="昵称" prop="nickname">
                <el-input
                  v-model.trim="form.nickname"
                  placeholder="请输入昵称"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="注册时间" prop="createdAt">
                <el-input v-model="form.createdAt" disabled />
              </el-form-item>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">私有信息</h2>
            <p class="section-desc">这些信息仅对您可见，不会公开显示</p>

            <div class="form-grid">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="form.email" placeholder="请输入邮箱" />
              </el-form-item>

              <el-form-item label="手机号码" prop="phone">
                <el-input v-model.trim="form.phone" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </div>
          </div>

          <div class="form-actions">
            <el-button @click="authStore.getMe()">重置</el-button>
            <el-button type="primary" :loading="isLoading" @click="handleSave">保存更改</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  margin: 0 auto;
  padding: 0 32px;
}

.settings-header {
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.settings-title {
  font-size: 26px;
  font-weight: 600;
  color: #24292f;
  margin: 0 0 8px 0;
}

.settings-desc {
  color: #57606a;
  font-size: 14px;
  margin: 0;
}

.settings-content {
  display: flex;
  gap: 32px;
}

.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.user-card {
  background: #f6f8fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
}

.avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
  margin-bottom: 4px;
}

.user-role {
  font-size: 12px;
  color: #57606a;
}

.sidebar-nav {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #24292f;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f6f8fa;
}

.nav-item.active {
  background: #f6f8fa;
  border-left-color: #0969da;
  font-weight: 500;
}

.settings-main {
  flex: 1;
  min-width: 0;
}

.settings-form {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.form-section {
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 12px;
  color: #57606a;
  margin: 0 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.form-grid :deep(.el-form-item) {
  margin-bottom: 0;
}

.form-grid :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
  padding-bottom: 8px !important;
}

.form-grid :deep(.el-input__wrapper) {
  border-radius: 6px;
}

.form-grid :deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f6f8fa;
  cursor: not-allowed;
}

.form-grid :deep(.el-input.is-disabled .el-input__inner) {
  color: #57606a;
  cursor: not-allowed;
}

.form-actions {
  padding: 16px 24px;
  background: #f6f8fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-radius: 0 0 6px 6px;
}

@media (max-width: 768px) {
  .settings-content {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
