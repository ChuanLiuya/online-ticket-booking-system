<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@lucide/vue'
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
  await formRef.value.validate((valid) => {
    if (valid) {
      dialogState.value = 'disabled'
    }
  })
}

</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户登录"
    width="500"
    align-center
    @close="() => { if (dialogState === 'login') dialogState = 'disabled' }"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" status-icon>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
      </el-form-item>
      <div class="form-toggle">
        还没有账号？ <span @click="dialogState = 'register'" class="toggle-link">立即注册</span>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogState = 'disabled'">取消</el-button>
        <el-button type="primary" @click="clickLoginButton">登录</el-button>
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
