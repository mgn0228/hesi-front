let PAGE_SIZE = 10;
let PAGE_NO = 1;
let DOC_NO = 'work-permit';
let IS_ASC = false;
let DOC_SORT_TYPE = 'CREATE_AT'

$(function () {
    DOC_NO = $('#docNo').val();
    setDocList();
    enterKeyEvent($('#s_searchValue'), search);
})

function setDocList(pageNo) {
    if(pageNo) PAGE_NO = pageNo;

    let apiUrl;

    switch(DOC_NO) {
        case 'work-permit' : apiUrl = '/doc/list/doc-work-permit'; break;
        case 'time-work-permit' : apiUrl = '/doc/list/doc-time-work-permit'; break;
        case 'object-handling-plan' : apiUrl = '/doc/list/doc-object-handling-plan'; break;
        case 'space-work-permit' : apiUrl = '/doc/list/doc-space-work-permit'; break;
        case 'risk-assessment-table' : apiUrl = '/doc/list/doc-risk-assessment-table'; break;
        case 'transport-handling-plan' : apiUrl = '/doc/list/doc-transport-handling-plan'; break;
    }

    callAPI(
        {
            method: "GET",
            url: SERVER_URL + apiUrl,
            params: {
                'page': PAGE_NO,
                'size': PAGE_SIZE,
                'projectId': PROJECT_ID,
                'isAsc': IS_ASC,
                'docSortType': DOC_SORT_TYPE,
                'keyword': $('#s_searchValue').val()
            }
        },
        function (response) {
            if (response.status === 200) {
                const data = response.data.data;
                const listCount = data?.total_elements;
                let html = `<li class="tr"><div class="empty_list">등록된 문서가 없습니다.</div></li>`;

                if(listCount > 0) {
                    html = ``;

                    data.content.forEach(function(item, idx) {
                        html += `
                            <li class="tr">
                                <div class="cell_num">${makeListNo(listCount, idx, PAGE_NO, PAGE_SIZE)}</div>
                                <div class="cell_subject column">
                                    <span class="fs16"><a href="/doc/created/detail/${DOC_NO}/${item.id}">${item.document_name}</a></span>
                                    <sub>
                                        <span>작성자: ${item.user_name}</span>
                                        <span>등록일: ${item.created_at.substring(0,10)}</span>
                                    </sub>
                                </div>
                                <div class="cell_14">
                                    <a href="/doc/created/detail/${DOC_NO}/${item.id}" class="_btn/line/blue">문서열기</a>
                                </div>
                            </li>
                        `;
                    });
                }

                $('.tbody').html(html);

                makePaging(Math.ceil(listCount / PAGE_SIZE), PAGE_NO, setDocList);
            }
        }
    );
}

function sortEvent(e, sortType) {
    DOC_SORT_TYPE = sortType;

    if ($(e).hasClass('asc')) {
        $(e).removeClass('asc');
        $(e).addClass('desc');
        IS_ASC = false;

    } else {
        $(e).removeClass('desc');
        $(e).addClass('asc');
        IS_ASC = true;
    }

    setDocList();
}

// 검색
function search() {
    PAGE_NO = 1;
    setDocList();
}