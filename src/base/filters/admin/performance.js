const performance = {
  getFormulaDataList() {
    return {
      person_fb_spent: {id: 'person_fb_spent', label: '个人FB消耗完成率', info: '个人FB消耗完成率=个人实际FB消耗/个人目标FB消耗'},
      person_tt_spent: {id: 'person_tt_spent', label: '个人TT消耗完成率', info: '个人TT消耗完成率=个人实际TT消耗/个人目标TT消耗'},
      dept_fb_spent: {id: 'dept_fb_spent', label: '部门FB消耗完成率', info: '部门FB消耗完成率=部门实际FB消耗/部门目标FB消耗'},
      dept_tt_spent: {id: 'dept_tt_spent', label: '部门TT消耗完成率', info: '部门TT消耗完成率=部门实际TT消耗/部门目标TT消耗'},
      trail_timeout: {id: 'trail_timeout', label: '超时线索占比', info: '超时线索占比=超时线索数/全部线索数'},
      person_trail: {
        id: 'person_trail', label: '个人线索完成率', info: '线索完成率=实际有效线索数/目标线索数',
        options: [
          {id: '线下活动'}, {id: '直播'}, {id: '合作伙伴'}, {id: '微信'}, {id: '公众号'},
          {id: '官网'}, {id: '其他'}, {id: '广告'}, {id: 'OE'},
        ]
      },
      dept_trail: {id: 'dept_trail', label: '部门线索完成率', info: '线索完成率=实际有效线索数/目标线索数'},
      repay: {id: 'repay', label: '回款率', info: '回款率=已还金额/应付金额'},
      person_profit: {id: 'person_profit', label: '个人盈利目标达成率', info: '手动填写'},
      dept_profit: {id: 'dept_profit', label: '部门盈利目标达成率', info: '手动填写'},
      avg_month_grade: {id: 'avg_month_grade', label: '月度平均分', info: '月度平均分=SUM(月度考核分)/月数'}
    }
  },
  getTargetList() {
    return {
      person_spent: {id: 'person_spent', label: '个人消耗目标(FB+TT)'},
      person_fb_spent: {id: 'person_fb_spent', label: '个人FB消耗目标'},
      person_tt_spent: {id: 'person_tt_spent', label: '个人TT消耗目标'},
      dept_spent: {id: 'dept_spent', label: '部门消耗目标(FB+TT)'},
      dept_fb_spent: {id: 'dept_fb_spent', label: '部门FB消耗目标'},
      dept_tt_spent: {id: 'dept_tt_spent', label: '部门TT消耗目标'},
      person_trail: {id: 'person_trail', label: '个人获客目标'},
      dept_trail: {id: 'dept_trail', label: '部门获客目标'},
      person_profit: {id: 'person_profit', label: '个人利润目标'},
      dept_profit: {id: 'dept_profit', label: '部门利润目标'},
      avg_month_grade: {id: 'avg_month_grade', label: '月度平均分'},
      avg_season_grade: {id: 'avg_season_grade', label: '季度平均分'},
      summary: {id: 'summary', label: '总结'},
    }
  }
}

export default performance