async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  await loadTool('AIScheduleTools')
  
  const ifr = dom.getElementsByTagName("iframe")
  dom = ifr[0].contentDocument.body.parentElement

  const selectElement = dom.querySelector('#allSemesters')
  // 获取第一个 option 的 value 值
  const semesterNo = selectElement.value;

  // 使用Fetch请求教务的接口
  try {
    const data = await fetch(`https://bk.cup.edu.cn/student/for-std/course-table/semester/${semesterNo}/print-data`)
    const res = await data.json()
    
    return JSON.stringify(res) + ' ' + String(semesterNo)
  } catch (error) {
    console.error(error)
    await AIScheduleAlert(error.message)
    return 'do not continue'
  }
}
