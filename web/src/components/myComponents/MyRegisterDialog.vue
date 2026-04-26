<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Mail, Lock, LockKeyhole } from '@lucide/vue'
const dialogState = defineModel<'login' | 'register' | 'disabled'>({ required: true })
const dialogVisible = computed(() => dialogState.value === 'register')
const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const clickRegisterButton = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('注册信息:', form)
      dialogState.value = 'disabled'
    }
  })
}

</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户注册"
    width="500"
    align-center
    @close="() => { if (dialogState === 'register') dialogState = 'disabled' }"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" status-icon>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User"/>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" :prefix-icon="Mail"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          :prefix-icon="LockKeyhole"
          show-password
        />
      </el-form-item>
      <div class="form-toggle">
        已有账号？ <span @click="dialogState = 'login'" class="toggle-link">立即登录</span>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogState = 'disabled'">取消</el-button>
        <el-button type="primary" @click="clickRegisterButton">注册</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-toggle {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.toggle-link {
  color: #409EFF;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #66b1ff;
    text-decoration: underline;
  }
}
</style>
