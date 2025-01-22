$(function() {
    getProjectList();
});
// 프로젝트 리스트 조회
// CommInterceptor 를 이용하는 소스
/*function getProjectList() {

    const user = userInfo();

    if(!user?.project_id) {
        // 세션스토리지에 project id가 없는 경우에만 첫번 째 값 셋팅
        user['project_id'] = PROJECT_LIST[0].id;
        localStorage.setItem('user', JSON.stringify(user));
    }

    setProjectList(PROJECT_LIST);
}*/
// 프로젝트 리스트 조회
async function getProjectList() {
    let projectList = [];

    await callAPI(
        {
            method: "GET",
            url: SERVER_URL + '/project/list/' + COMPANY_ID,
            headers: { Authorization: `Bearer ${TOKEN}` }
        },
        function(response) {
            projectList = response.data?.data;
        }
    );

    return projectList;
}