// 파일 확장자 체크
function checkFileExt(file, ext) {
    // ext 예시 : "png,jpg,gif"
    let check = false;
    const fileName = file.name;

    const extName = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    const str = ext.split(",");

    for (let i = 0; i < str.length; i++) {
        if (extName === str[i].trim()) {
            check = true;
            break;

        } else {
            check = false;
        }
    }

    if ( !check ) {
        alert(ext + " 파일만 업로드 가능합니다.");
    }

    return check;
}

// 파일 사이즈 체크
function checkFileSize(file, size) {
    // size : MB 기준
    // 5MB = (1024 * 1024) * 5
    let check = false;
    const sizeinbytes = file.size;
    let checkSize = size;

    while (checkSize > 900) {
        checkSize /= 1024;
    }

    checkSize = (Math.round(checkSize * 100) / 100) + '' + 'MB';

    if (sizeinbytes > size) {
        alert("첨부파일은 " + checkSize + " 이하로 첨부 바랍니다.");

    } else {
        check = true;
    }

    return check;
}

// EQUIPMENT_SPECIFICATION(장비 제원) 파일들만 중복 치크
function checkDuplicateFile(file) {
    let check = true;

    // 새로 등록된 파일 배열에서 체크
    if(FILE_ARRAY.length > 0) {
        $(FILE_ARRAY.filter(function(f) {
            // EQUIPMENT_SPECIFICATION(장비 제원) 파일들만 filter
            return f.fileType === 'EQUIPMENT_SPECIFICATION';

        })).each(function(idx, jsonObject) {
            // 파일 이름과 파일 사이즈 모두 동일한게 있으면 첨부 불가
            if(file.name === jsonObject.file.name && file.size === jsonObject.file.size) {
                alert('중복된 파일을 등록하였습니다.');
                check = false;
                return false;
            }
        });
    }

    // 기존 등록된 파일 배열에서 체크
    if(check && OG_FILE_ARRAY.length > 0) {
        $(OG_FILE_ARRAY).each(function(idx2, ogFile) {
            // 파일 이름과 파일 사이즈 모두 동일한게 있으면 첨부 불가
            if(file.name === ogFile.name && file.size === ogFile.size) {
                alert('중복된 파일을 등록하였습니다.');
                check = false;
                return false;
            }
        });
    }

    return check;
}

// 장비 제원 파일 onchange 이벤트
function changeEquipmentFile(elem) {
    /**
     * 파일 최대 10개
     * 파일당 최대 5MB
     * png,jpg,gif 파일만 업로드 가능
     * 이름,사이즈로 중복체크
     * */
    $(elem.files).each(function(idx,file) {
        if(FILE_CNT < 10) {
            if (checkFileExt(file, "png,jpg,gif") && checkFileSize(file, (1024 * 1024) * 5) && checkDuplicateFile(file)) {
                FILE_ARRAY.push({
                    'seq': ++FILE_SEQ,
                    'file': file,
                    'fileType': 'EQUIPMENT_SPECIFICATION'
                });

                let fileNode = `
                    <li>
                        <span class="li_del" onclick="delFile(${FILE_SEQ}, this)"></span>
                        <span class="file_name">${file.name}</span>
                        <span class="file_size">${fileSizeToMB(file.size)}MB</span>
                    </li>
                `;

                $('#equipment_files').append(fileNode);
                this.value = '';
                FILE_CNT++;

            }else {
                return false;
            }

        }else {
            alert('최대 10개까지 첨부할 수 있습니다.');
            return false;
        }
    });




    let orgParent = elem.parentNode;
    let orgNext = elem.nextSibling;
    let tmp = document.createElement('form');
    tmp.appendChild(elem);
    tmp.reset();
    orgParent.insertBefore(elem,orgNext);
}