import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { customLocalStorage } from './customLocalStorage'

const SubPageAccess = () => {
  const router = useRouter()

  return useEffect(() => {
    if (
      (customLocalStorage() &&
        customLocalStorage().userInfo &&
        !customLocalStorage().userInfo.group) ||
      customLocalStorage().userInfo.group !== 'admin'
    ) {
      router.push('/')
    }
  }, [router])
}

export default SubPageAccess
