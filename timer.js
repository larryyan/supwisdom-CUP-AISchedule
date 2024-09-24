/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({
  providerRes,
  parserRes
} = {}) {
  // Find the last space in the string
  const lastSpaceIndex = providerRes.lastIndexOf(' ');

  // Split the string into two parts
  const jsonString = providerRes.substring(0, lastSpaceIndex); // JSON part
  const semesterNo = providerRes.substring(lastSpaceIndex + 1); // Semester number part

  const json = JSON.parse(jsonString)
  const courseUnitList = json.studentTableVms[0].timeTableLayout.courseUnitList

  // Initialize counts
  let forenoon = 0;
  let afternoon = 0;
  let night = 0;

  // Iterate through the courseUnitList and categorize by dayPart
  courseUnitList.forEach(unit => {
    switch (unit.dayPart) {
      case 'MORNING':
        forenoon++;
        break;
      case 'AFTERNOON':
        afternoon++;
        break;
      case 'EVENING':
        night++;
        break;
    }
  });

  // Function to format time from integer (e.g., 800 to "08:00")
  const formatTime = time => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Mapping courseUnitList to the required sections array
  const sections = courseUnitList.map(unit => ({
    section: unit.indexNo, // Section number
    startTime: formatTime(unit.startTime), // Formatted start time
    endTime: formatTime(unit.endTime) // Formatted end time
  }));

  const info = await fetch(`https://bk.cup.edu.cn/student/ws/semester/get/${semesterNo}`)
  const infoJson = await info.json()
  const startDate = new Date(infoJson.startDate + 'T00:00:00+08:00')
  const endDate = new Date(infoJson.endDate + 'T00:00:00+08:00')

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days, then divide by 7 to get weeks
  const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeks = differenceInMilliseconds / millisecondsPerWeek;

  // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
  return {
    totalWeek: Math.ceil(weeks), // 总周数：[1, 30]之间的整数
    startSemester: String(startDate.getTime()), // 开学时间：时间戳，13位长度字符串，推荐用代码生成
    startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    showWeekend: true, // 是否显示周末
    forenoon: forenoon, // 上午课程节数：[1, 10]之间的整数
    afternoon: afternoon, // 下午课程节数：[0, 10]之间的整数
    night: night, // 晚间课程节数：[0, 10]之间的整数
    sections: sections, // 课程时间表，注意：总长度要和上边配置的节数加和对齐
  }
}