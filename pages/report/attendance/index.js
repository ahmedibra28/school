import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'

const index = () => {
  return <div>Attendance Report</div>
}

export default dynamic(() => Promise.resolve(withAuth(index)), {
  ssr: false,
})
