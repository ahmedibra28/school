export const routes = () => {
  return [
    {
      isActive: true,
      menu: 'Normal',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      menu: 'Profile',
      path: '/profile',
      name: 'Profile',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/branch',
      name: 'Branch',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/p12school',
      name: 'P12 School',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/subject',
      name: 'Subject',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/classroom',
      name: 'Classroom',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/teacher',
      name: 'Teacher',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/student',
      name: 'Student',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/exam',
      name: 'Exam',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/mark',
      name: 'Mark',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/tuitionfee',
      name: 'Tuition Fee',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/attendance',
      name: 'Attendance',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/document',
      name: 'Document',
    },
  ]
}

export const groups = (ids) => {
  return [
    {
      name: 'admin',
      isActive: true,
      route: ids,
    },
  ]
}

export const users = () => {
  return [
    {
      password: '123456',
      name: 'Ahmed',
      email: 'ahmaat19@gmail.com',
      group: 'admin',
    },
  ]
}
