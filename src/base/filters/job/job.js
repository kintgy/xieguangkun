import api from '@/request/api'

const job = {
  getSex: () => {
    return [
      {id: '0', name: '女'},
      {id: '1', name: '男'},
    ]
  },
  getEducation: () => {
    return [
      {id: '1', name: '高中及以下'},
      {id: '2', name: '大专'},
      {id: '3', name: '本科'},
      {id: '4', name: '硕士'},
      {id: '5', name: '博士'},
    ]
  },
  getPoliticsStatus: () => {
    return [
      {id: '1', name: '群众'},
      {id: '2', name: '共青团员'},
      {id: '3', name: '中共党员'},
    ]
  },
  getMaritalStatus: () => {
    return [
      {id: '1', name: '已婚'},
      {id: '2', name: '未婚'},
    ]
  },
  getJob: () => {
    return [
      {id: '11', name: '电商优化师'},
      {id: '12', name: 'app优化师'},
      {id: '13', name: '综合优化师'},
      {id: '20', name: '素材'},
      {id: '30', name: '商务'},
      {id: '40', name: '媒介'},
      {id: '100', name: '其他'},
    ]
  },
  statusList: {},
  initStatus: async () => {
    if (JSON.stringify(job.statusList) !== '{}') return job.statusList
    job.statusList = await api.job.getTalentStatusList()
    return job.statusList
  },
  posts: [],
  initPosts: async () => {
    if (job.posts && job.posts.length > 0) return job.posts
    job.posts = await api.admin.user.post.all()
    return job.posts
  },
  getCreateUserId: () => {
    return [
      {id: '13', name: '梁雪梅'},
      {id: '37', name: '沈陆豪'},
    ]
  },
  getStatusName: val => {
    return job.statusList && job.statusList[val] ? job.statusList[val] : ''
  },
  getPostName: val => {
    let name = ''
    for (const post of job.posts) {
      if (parseInt(val) === post.id) name = post.name
    }
    return name
  },
  getStatusAlert: val => {
    // 10: '标为【HR初筛】的简历将...'
    // 11: '标为【简历储备】的简历将...'
    // 12: '标为【HR初筛不通过】的简历将进行归档，且操作不可逆，请谨慎操作！'
    // 20: '标为【部门复筛】的简历将...'
    // 21: '标为【部门复筛不通过】的简历将...'
    // 30: '标为【面试邀约】的简历将...'
    // 40: '标为【面试中】的简历将...'
    // 41: '标为【初试未通过】的简历将...'
    // 42: '标为【复试未通过】的简历将...'
    // 43: '标为【未参加面试】的简历将...'
    // 50: '标为【待发放offer】的简历将...'
    // 51: '标为【被拒offer】的简历将...'
    // 60: '标为【待入职】的简历将...'
    // 61: '标为【拒绝入职】的简历将...'
    // 70: '标为【试用期】的简历将...'
    // 71: '标为【试用期不通过】的简历将...'
    // 80: '标为【正式员工】的简历将...'

    if (val === 12) return '标为【' + job.getStatusName(val) + '】的简历将进行归档，且操作不可逆，请谨慎操作！'
  }
}

job.initStatus()
job.initPosts()

export default job
