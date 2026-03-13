async function scheduleHtmlProvider() {
    const dom = await fetch('https://bk.cup.edu.cn/student/for-std/course-table')
                .then(res => res.text())
                .then(html => new DOMParser().parseFromString(html, 'text/html'));

    const selectElement = dom.querySelector('#allSemesters')
    // 获取第一个 option 的 value 值
    const semesterNo = selectElement.value;

    // 使用Fetch请求教务的接口
    const data = await fetch(`https://bk.cup.edu.cn/student/for-std/course-table/semester/${semesterNo}/print-data`)
    const res = await data.json()
    
    return JSON.stringify(res) + ' ' + String(semesterNo)
}