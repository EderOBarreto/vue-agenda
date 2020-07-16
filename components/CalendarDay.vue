<template>
  <td
    :class="['calendar-day', { '-weekend': isWeekend }]"
    @click.self="createReminder"
  >
    <strong :class="['day', { '-active-month': isCurrentMonth }]">
      {{ date }}
    </strong>
    <div class="reminders">
      <div
        v-for="(remind, index) of reminders"
        :key="index"
        class="reminder"
        :style="`background:${remind.color}`"
        @click="showReminder"
      >
        <span class="text">
          {{ remind.subject }}
        </span>
      </div>
    </div>
  </td>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IReminder } from '~/core/models/reminder'

@Component
class CalendarDay extends Vue {
  @Prop() readonly date!: number
  // @Prop() readonly date!: number change to Date instead
  @Prop() readonly reminders!: IReminder[]
  @Prop() readonly isCurrentMonth!: boolean
  @Prop() readonly isCurrentDay!: boolean
  @Prop({ default: false }) readonly isWeekend!: boolean

  // TODO: more than 3 reminders
  // show more field

  showReminder() {
    // TODO: show selected reminder
  }

  createReminder() {
    // TODO: show reminder form
  }
}

export default CalendarDay
</script>

<style lang="scss" scoped>
.calendar-day {
  background-color: white;
  height: 100px;
  position: relative;
  border: 1px solid #a3a3a3;
  vertical-align: bottom;
  cursor: pointer;
}

.calendar-day > .day {
  position: absolute;
  color: lighten(#000, 50%);
  top: 5px;
  left: 5px;
}

.calendar-day > .day.-active-month {
  color: black;
}

.calendar-day.-weekend {
  background: #f2f2f2;

  > .day.-active-month {
    color: #366da7;
  }
}

.calendar-day > .reminders {
  display: grid;
  grid-template-rows: repeat(3, 20px);
  gap: 5px;
  height: 70px;
}

.calendar-day > .reminders > .reminder {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 2px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
}

/* .calendar-day > .reminders > .reminder > .text {
} */
</style>
