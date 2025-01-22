package com.test.front.hesi.controller;

import com.test.front.hesi.external.ExternalAPI;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Objects;

@Controller
public class CommController {

    @Value("${backend-url}")
    private String backendUrl;

    @RequestMapping(value = {"/", "/login"}, name = "로그인")
    public String login(HttpServletRequest request, Model model) {
        /*
         * 로그인 페이지로 넘어오기 이전에 요청받은 reqUrl 값이 있으면 정보 유지
         * 로그인 이후에 reqUrl를 이용해서 페이지 이동시킴
         * */
        String reqUrl = request.getParameter("reqUrl");
        if (!StringUtils.isEmpty(reqUrl)) {
            model.addAttribute("reqUrl", reqUrl);
        }

        HttpSession session = request.getSession(true);
        Object statusCode = session.getAttribute("statusCode");

        if (Objects.isNull(statusCode)) {
            // statusCode == null, 즉 인터셉터에 걸린게 아닌 로그인페이지로 직접 들어 온 경우 토큰 검증 실행
            ExternalAPI externalAPI = new ExternalAPI();
            boolean isTokenValid = externalAPI.checkToken(request, backendUrl);

            if (isTokenValid) {
                // 검증 통과
                if (!StringUtils.isEmpty(reqUrl)) {
                    return "redirect:" + reqUrl;

                } else {
                    // 메인으로 이동
                    return "redirect:/doc/created/list/work-permit";
                }
            }

        } else {
            // 인터셉터에서 토큰 검증 실패한 경우
            if (statusCode == HttpStatus.UNAUTHORIZED) {
                model.addAttribute("statusCode", HttpStatus.UNAUTHORIZED.value());
                session.invalidate();
            }
        }

        return "html/login.html";
    }

    @RequestMapping(value = "/login/save", name = "로그인 후 정보 저장")
    @ResponseBody
    public Boolean loginSave(@RequestBody HashMap<String, String> map, HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        session.setMaxInactiveInterval(60 * 60 * 2); // 2시간

        session.setAttribute("accessToken", map.get("access_token"));
        session.setAttribute("userName", map.get("user_name"));
        session.setAttribute("userId", map.get("user_id"));
        session.setAttribute("companyId", map.get("company_id"));
        session.setAttribute("projectId", map.get("project_id"));
        session.setAttribute("userAuth", map.get("user_auth"));
        session.setAttribute("userImg", map.get("user_img"));
        session.setAttribute("projectName", map.get("project_name"));

        return true;
    }

    @RequestMapping(value = "/projectId/save", name = "프로젝트 pk 세션에 저장")
    @ResponseBody
    public Boolean projectPkSave(@RequestBody HashMap<String, String> map, HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        session.setAttribute("projectId", map.get("project_id"));
        return true;
    }

    @RequestMapping(value = "/logout", name = "로그아웃")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        session.invalidate();
        return "redirect:/login";
    }

    @RequestMapping(value = "/signup", name = "회원가입")
    public String signup(HttpServletRequest request) {
        HttpSession session = request.getSession(true);

        Object auth = session.getAttribute("userAuth");

        if (Objects.isNull(auth)) {
            return "redirect:/logout";

        } else {
            if (!String.valueOf(auth).equals("ADMIN")) {
                return "redirect:/";
            }
        }
        return "html/signup.html";
    }

    @RequestMapping(value = "/mypage", name = "마이페이지")
    public String mypage(Model model) {
        model.addAttribute("menu", "마이페이지");
        return "html/mypage.html";
    }

    @RequestMapping(value = "/doc/approval/list", name = "결재 문서함 목록")
    public String approvalDocument(Model model) {
        model.addAttribute("menu", "결재문서함");
        return "html/doc/approval/list.html";
    }

    @RequestMapping(value = "/member", name = "구성원 목록")
    public String member(Model model) {
        model.addAttribute("menu", "구성원");
        return "html/member.html";
    }

    @RequestMapping(value = "/doc/created/list/{docNo}", name = "문서 작성함 목록")
    public String docCreatedList(@PathVariable("docNo") String docNo, Model model) {
        model.addAttribute("menu", "문서작성함");
        model.addAttribute("docNo", docNo);
        return "html/doc/created/list.html";
    }

    @RequestMapping(value = "/doc/storage/list", name = "문서 저장소 목록")
    public String docStorageList(Model model) {
        model.addAttribute("menu", "문서저장소");
        return "html/doc/storage/list.html";
    }

    @RequestMapping(value = "/doc/{menuType}/approval/{docNo}/{id}", name = "(공통) 결재자 지정")
    public String docCreatedApprovalRequest(@PathVariable("menuType") String menuType, @PathVariable("docNo") String docNo, @PathVariable("id") Long id, Model model) {
        model.addAttribute("menuType", menuType);
        model.addAttribute("menu", getMenu(menuType));
        model.addAttribute("id", id);

        docNo = docNo.replaceAll("-","_");
        return "html/doc/common/approval/" + docNo + ".html";
    }

    @RequestMapping(value = "/doc/{menuType}/detail/{docNo}/{id}", name = "(공통) 문서 상세")
    public String docCommonDetail(@PathVariable("menuType") String menuType, @PathVariable("docNo") String docNo, @PathVariable("id") Long id, Model model) {
        model.addAttribute("menuType", menuType);
        model.addAttribute("menu", getMenu(menuType));
        model.addAttribute("id", id);

        docNo = docNo.replaceAll("-","_");
        return "html/doc/common/detail/" + docNo + ".html";
    }

    @RequestMapping(value = "/doc/{menuType}/write/{docNo}", name = "(공통) 문서 작성, 편집, 복사")
    public String docCommonWrite(@PathVariable("menuType") String menuType, @PathVariable("docNo") String docNo, Model model) {
        model.addAttribute("menuType", menuType);
        model.addAttribute("menu", getMenu(menuType));

        docNo = docNo.replaceAll("-","_");
        return "html/doc/common/write/" + docNo + ".html";
    }

    private String getMenu(String menuType) {
        return switch (menuType) {
            case "approval" -> "결재문서함";
            case "created" -> "문서작성함";
            case "storage" -> "문서저장소";
            default -> "";
        };
    }

    /*@RequestMapping(value = "/", name = "랜딩페이지")
    public String index(HttpServletRequest request) {
        ExternalAPI externalAPI = new ExternalAPI();
        boolean isTokenValid = externalAPI.checkToken(request, backendUrl);

        if(isTokenValid) {
            // 검증 통과시 바로 메인으로 이동
            return "redirect:/dashboard";
        }

        return "html/index.html";
    }*/

    /*@RequestMapping(value = "/find/id", name = "아이디 찾기")
    public String findId() {
        return "html/find_id.html";
    }*/

    /*@RequestMapping(value = "/find/pw", name = "비밀번호 찾기")
    public String findPw() {
        return "html/find_pw.html";
    }*/

    /*@RequestMapping(value = "/dashboard", name = "현장 대시보드")
    public String dashboard(Model model) {
        model.addAttribute("menu", "현장대시보드");
        return "html/dashboard.html";
    }*/
}