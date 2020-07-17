<template>
  <form class="reminder-form">
    <div v-if="weatherStaus" class="">Weather : {{ weatherStaus }}</div>
    <div class="item">
      <label for="subject">*Subject:</label>
      <input id="subject" v-model="form.subject" type="text" name="suject" />
    </div>
    <div class="item">
      <label for="date">*Date</label>
      <input id="date" v-model="form.date" type="date" name="date" />
    </div>
    <div class="item">
      <label for="time">*Time</label>
      <input id="time" v-model="form.time" type="time" name="time" />
    </div>
    <div class="item">
      <label for="city">*City</label>
      <input id="city" v-model="form.city" type="text" name="city" />
    </div>
    <div class="item">
      <label for="color">Label color: </label>
      <input
        id="color"
        v-model="form.color"
        type="color"
        name="color"
        value="#000000"
      />
    </div>
    <button class="save" :disabled="!formIsValid" @click.prevent="saveReminder">
      {{ isEditing ? 'Edit' : 'Save' }}
    </button>
    <button v-if="isEditing" class="delete" @click.prevent="deleteReminder">
      Delete
    </button>
  </form>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import { getModule } from 'vuex-module-decorators'
import Calendar from '~/store/calendar'
import { IReminder } from '~/core/models/reminder'

@Component
class Reminder extends Vue {
  form: IReminder = {
    subject: '',
    date: '',
    time: '',
    city: '',
    color: '#000000',
  }

  isEditing = false
  weatherStaus = ''

  @Prop() readonly date!: string

  calInstance = getModule(Calendar, this.$store)

  @Watch('date')
  setDate() {
    this.clearFields()
    this.form.date = this.date
  }

  @Watch('calInstance.curReminder')
  setReminder(reminder: IReminder) {
    if (reminder) {
      this.form = { ...reminder }
      this.isEditing = true
    } else {
      this.isEditing = false
    }
  }

  @Watch('form.city')
  @Watch('form.date')
  async getWeatherStatus() {
    if (this.form.date && this.form.city) {
      let weatherData: any = []
      await this.$axios
        .$get(
          process.env.OPEN_WEATHER_API +
            '?q=' +
            this.form.city +
            '&appid=' +
            process.env.OPEN_WEATHER_KEY
        )
        .then((res: any) => {
          weatherData = res.list
        })

      const weatherDay = weatherData.find((forecast: any) => {
        return forecast.dt_txt.substring(0, 10) === this.form.date
      })
      this.weatherStaus = weatherDay
        ? weatherDay.weather[0].main
        : 'Not available'
    }
  }

  get formIsValid() {
    const subjectLenght = this.form.subject.trim().length
    if (subjectLenght <= 0 || subjectLenght > 30) return false
    if (!this.form.date) return false
    if (!this.form.time) return false
    if (!this.form.city.trim()) return false
    return true
  }

  createReminder() {
    this.calInstance.saveReminder({ ...this.form })
  }

  editReminder() {
    this.calInstance.deleteSelectedReminder()
    this.calInstance.saveReminder({ ...this.form })
  }

  deleteReminder() {
    this.calInstance.deleteSelectedReminder()
    this.$emit('close-modal')
  }

  saveReminder() {
    if (this.formIsValid) {
      if (this.isEditing) {
        this.editReminder()
      } else {
        this.createReminder()
      }
      this.calInstance.clearSelectedReminder()
      this.clearFields()
      this.$emit('close-modal')
    }
  }

  clearFields() {
    this.form = {
      subject: '',
      date: '',
      time: '12:00',
      city: '',
      color: '#000000',
    }
  }
}

export default Reminder
</script>

<style lang="scss" scoped>
.reminder-form {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.reminder-form > .save {
  background-color: red;
  color: white;
  font-weight: 600;
  height: 30px;
  border-radius: 6px;
  border: 0;
  cursor: pointer;

  &:disabled {
    background-color: rgba(red, 0.5);
  }
}
</style>
