<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { AppError } from '@/utils/errors'
const authStore = useAuthStore()
const dialogState = defineModel<'login' | 'register' | 'disabled'>({ required: true })
const dialogVisible = computed(() => dialogState.value === 'login')
const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const clickLoginButton = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请正确填写信息')
      return
    } else {
      try {
        await authStore.login(form)
        ElMessage.success('登录成功')
        dialogState.value = 'disabled'
      } catch (error) {
        if (error instanceof AppError) {
          ElMessage.error(error.message)
        } else {
          ElMessage.error('遇到未知错误，请稍后重试')
        }
      }
    }
  })
}

onMounted(() => {
  form.username = sessionStorage.getItem('username') || ''
  form.password = sessionStorage.getItem('password') || ''
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('password')
})

</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户登录"
    width="420"
    align-center
    @close="() => { if (dialogState === 'login') dialogState = 'disabled' }"
    :close-on-click-modal="false"
  >
    <div class="welcome-text">
      <h2>欢迎回来!</h2>
      <p>请登录您的账号继续购票</p>
    </div>
    <div class="form-container">
      <el-form ref="formRef" :model="form" :rules="rules" status-icon class="form">
      <el-form-item prop="username">
        <el-input class="input" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input class="input" v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
      </el-form-item>
      <div class="form-toggle">
        还没有账号？ <span @click="dialogState = 'register'" class="toggle-link">立即注册</span>
      </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogState = 'disabled'">取消</el-button>
        <el-button type="primary" @click="clickLoginButton">登录</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.welcome-text {
  text-align: center;
  margin-bottom: 24px;

  h2 {
    margin: 0 0 8px 0;
    font-size: 22px;
    font-weight: 600;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .form {

    .input {
      width: 300px;
    }

    .form-toggle {
    margin-top: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
  }

  .toggle-link {
    color: #409eff;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #66b1ff;
      text-decoration: underline;
    }
  }
  }


}
</style>
