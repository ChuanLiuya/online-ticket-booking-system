<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElLoading, type FormRules, type FormInstance } from 'element-plus'
import { EventStatus, type updateEventReqBody } from '@/types/event'
import { AppError } from '@/utils/errors'
import { useEventStore } from '@/stores/myEvents'
import router from '@/router'

const route = useRoute()

const eventStore = useEventStore()
const eventId = route.params.id as string
const formRef = ref<FormInstance>()
const form = reactive<updateEventReqBody>({
  title: '',
  description: '',
  image: '',
  location: '',
  startTime: new Date(),
  endTime: new Date(),
  price: 0,
  maxParticipants: 10,
  status: EventStatus.UPCOMING,
})
const rules = reactive<FormRules<updateEventReqBody>>({
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' },
    { min: 2, max: 200, message: '标题长度应在2-200个字符之间', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { max: 1000, message: '描述长度不能超过1000个字符', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' },
    { max: 1000, message: '地点长度不能超过1000个字符', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '请选择活动开始时间', trigger: 'change' },
    {
      validator: (_rule, value: Date, callback) => {
        if (!value) return callback(new Error('请选择开始时间'))
        if (value < new Date()) {
          callback(new Error('开始时间不能早于当前时间'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  endTime: [
    { required: true, message: '请选择活动结束时间', trigger: 'change' },
    {
      validator: (_rule, value: Date, callback) => {
        if (!value) return callback(new Error('请选择结束时间'))
        if (form.startTime && value <= form.startTime) {
          callback(new Error('结束时间不能早于或等于开始时间'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  price: [
    { required: true, message: '请输入门票价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '门票价格不能为负数', trigger: 'blur' },
  ],
  maxParticipants: [
    { required: true, message: '请输入最大参与人数', trigger: 'blur' },
    { type: 'number', min: 1, message: '最大参与人数不能小于1', trigger: 'blur' },
  ],
})
const isSubmitting = ref(false)


async function loadEvent () {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    const event = await eventStore.findEvent(eventId)
    form.title = event.title
    form.description = event.description
    form.location = event.location
    form.startTime = new Date(event.startTime)
    form.endTime = new Date(event.endTime)
    form.price = parseFloat(event.price)
    form.maxParticipants = event.maxParticipants
    form.status = event.status
    form.image = event.image
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取活动信息失败')
    }
  } finally {
    loading.close()
  }
}
onMounted(() => {
  loadEvent()
})

async function handleSubmitButtonClick () {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('请正确填写信息')
    return
  }

  isSubmitting.value = true
  const loading = ElLoading.service({
    lock: true,
    text: '修改活动中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    await eventStore.updateEvent(eventId, form)
    ElMessage.success('活动修改成功！')
    router.push('/profile/my-events')
  } catch (error) {
    if (error instanceof AppError) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('遇到未知错误，请稍后重试')
    }
  } finally {
    loading.close()
    isSubmitting.value = false
  }
}
function handleResetButtonClick () {
  loadEvent()
}


</script>

<template>
  <div class="container" id="container">
    <div class="header">
      <div class="title">修改活动</div>
    </div>

    <div class="form-container">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="107px" class="event-form">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>

        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动描述"
          />
        </el-form-item>

        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入活动地点" />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="门票价格" prop="price">
          <el-input-number
            v-model="form.price"
            placeholder="请输入门票价格"
            type="number"
            :min="0"
            :step="100"
            class="number-input"
          >
            <template #suffix>
              <span>元</span>
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item label="最大参与人数" prop="maxParticipants">
          <el-input-number
            placeholder="请输入最大参与人数"
            v-model="form.maxParticipants"
            :min="1"
            :step="1"
            class="number-input"
          >
            <template #suffix>
              <span>人</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitButtonClick" :loading="isSubmitting">
            修改活动
          </el-button>
          <el-button @click="handleResetButtonClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
}
.container {
  margin: 0 auto;
  background: #f5f5f5;
}

.header {
  margin-bottom: 30px;
  text-align: center;
  .title {
    font-size: 30px;
    color: #333;
  }
}

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .event-form {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
  .number-input {
    width: 200px;
  }
}
</style>
