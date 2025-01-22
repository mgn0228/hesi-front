// 전체 숫자
function isNum(value) {
    return /^[0-9]+$/.test(value);
}

// 전체 영문자
function isEng(value) {
    return /[a-zA-Z]/.test(value);
}

// 전체 한글
function isKor(value) {
    return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value);
}

// 전체 영어 소문자
function isEngaz(value) {
    return /[a-z]/.test(value);
}

// 전체 영어 대문자
function isEngAZ(value) {
    return /[A-Z]/.test(value);
}

// 전체 특수문자
function isSpc(value) {
    return /[~!@#$%^&*()_+|<>?:{}]/.test(value);
}

// 연락처 (10~12자 숫자)
function isPhone(value) {
    return /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/.test(value);
}

// 이메일
function isEmail(value) {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value);
}

// 비밀번호
function isPassword(value) {
    return /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,16}$/.test(value);
}

// 아이디 (5~20자 영소문자 or 영소문자+숫자)
function isId(value) {
    return /^[a-z]+[a-z0-9]{4,19}$/g.test(value);
}

// 이름 (2~30자 한글 or 영소문자 or 영대문자)
function isName(value) {
    return /^[|가-힣|a-z|A-Z|]{2,30}$/.test(value);
}

// 닉네임 (2자 이상 20자 이하, 영어 또는 숫자 또는 한글)
function isNickname(value) {
    return /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,20}$/.test(value);
}

// 제목 (2~60자 한글 or 영소문자 or 영대문자)
function isTitle(value) {
    return /^[|가-힣|a-z|A-Z|]{2,60}$/.test(value);
}