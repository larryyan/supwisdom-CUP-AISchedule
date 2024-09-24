function scheduleHtmlParser(providerRes) {
  // Find the last space in the string
  const lastSpaceIndex = providerRes.lastIndexOf(' ');

  // Split the string into two parts
  const jsonString = providerRes.substring(0, lastSpaceIndex); // JSON part
  const json = JSON.parse(jsonString)
  const activities = json.studentTableVms.flatMap(x => x.activities)
  
  const courseInfos = activities.map(activity => {
    return {
      name: activity.courseName, // Extracting course name
      position: `${activity.campus}${activity.room}`, // Combining building and room for position
      teacher: activity.teachers.join(" "), // Extracting teacher's name
      weeks: activity.weekIndexes, // Using week indexes directly
      day: activity.weekday, // Extracting weekday
      sections: Array.from({ length: activity.endUnit - activity.startUnit + 1 }, (_, i) => activity.startUnit + i) // Calculating sections
    };
  });

  return courseInfos
}