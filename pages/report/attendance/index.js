import { useState } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css'

const Attendance = () => {
  const [sDate, setSDate] = useState(new Date())
  const [eDate, setEDate] = useState(new Date())

  const handleSelect = (ranges) => {
    setSDate(ranges.selection.startDate)
    setEDate(ranges.selection.endDate)
  }

  const selectionRange = {
    startDate: sDate,
    endDate: eDate,
    key: 'selection',
  }

  return (
    <div className='row'>
      <div className=' col-1'>
        <DateRange
          className='w-auto'
          ranges={[selectionRange]}
          onChange={handleSelect}
        />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Attendance)), {
  ssr: false,
})
