# [Offboarding Doc] Dr.Tail Blog

Created: June 12, 2025 10:46 PM
Created by: Danny

# Project Overview

---

## **Project Description**

[노션 데이터베이스 기반의 닥터테일 블로그](https://www.notion.so/c2ffabbec2284a9cb919b29b47b34d58?pvs=21) 

## Purpose and Goals

- **Primary objectives**
    - 닥터테일 블로그의 전반적인 관리방식을 이해할 수 있다.
    - 추가 요구사항 발생 시 원활한 대응을 할 수 있다.
    - 이슈 발생 시 신속한 대처를 할 수 있다.
- **Current status**
    - 노션에 아티클을 작성하면 아티클의 `dev`, `prod` status 프로퍼티 값에 따라 [dev.drtail.us/blog](http://dev.drtail.us), [dr.tail.us/blog](http://dr.tail.us)에 아티클이 생성된다. (주로 제이드가 아티클 업로드)
        
        ![image.png](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/image.png)
        
    - 아티클의 canonical_path 프로퍼티 값을 기반으로 아티클의 URL이 User-Friendly한 형태로 생성된다.
    - SEO를 위한 sitemap indexing 처리가 이루어지고 있다.
    - 오너웹 블로그 리스트에서 Tag 클릭 시 해당 Tag에 맞는 아티클들을 필터링해서 볼 수 있다.

# **Codebase Summary**

---

## **Architecture Overview**

![image.png](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/image%201.png)

- **Design Patterns used:**
    - (Partial) Container/Presentational Pattern
        - Blog 컴포넌트(`src/containers/blog/index.tsx`) 는 SEO, 라우팅, 레이아웃 등 Container 역할을 하며, 실제 데이터 렌더링은 Articles와 같은 Presentational 컴포넌트가 담당합니다.
            
            Articles 컴포넌트 내부에서 UI 렌더링 라인과 비즈니스 로직이 공존하고 있어, (Partial) Container/Presentational Pattern이라고 명명함
            
            ```tsx
            const Blog = () => {
              const router = useRouter();
            
              return (
                <>
                  <Seo
                    title="Dr.Tail Blog | Pet Care Insight"
                    ogDescription="Your go-to resource for expert pet care tips and advice."
                    metaDescription="Stay informed with the latest trends, tips, and expert advice to keep your pets happy and healthy. Explore our articles for practical solutions and inspiring stories from fellow pet owners like you."
                    pathName={router.asPath}
                  />
                  <Articles />
                  <VetAssistantChat />
                </>
              );
            };
            ```
            
    - Custom Hook Pattern
        
        데이터 Fetching에 `useArticles`와 같은 커스텀 훅을 사용하여 로직을 분리합니다.
        
        ```tsx
         const {
            data,
            isPending,
            isFetching,
            isFetched,
            isFetchingNextPage,
            isError,
            hasNextPage,
            refetch,
            fetchNextPage,
          } = useArticles({
            tag: (router.query.tag as string)?.split(',')?.sort().toString(),
          });
        ```
        
- **System architecture**
    - Hybrid Static/Dynamic Architecture
        - Static generation for blog pages via `getStaticProps`
        - Dynamic client-side fetching for article lists using `useArticles`
    - Feature-based Directory Structure
        
        ```tsx
        src/
        ├── containers/blog/          # UI containers
        ├── features/blog/            # Business logic
        │   ├── hooks/queries/        # Data fetching
        │   ├── lib/                  # Utilities
        │   └── models/               # Type definitions
        └── pages/blog/               # Next.js routing
        ```
        
    - API Layer Architecture
        - Custom API routes: `src/pages/api/blog/articles.ts`
        - Integration with Notion API via `notionBlogInstance`
        - Vercel KV for caching canonical paths
    - State Management Architecture
        - **React Query** for server state management
    - Content Management Architecture
        - **Notion as CMS** - Content stored in Notion database
        - **Canonical URL mapping** - SEO-friendly URLs via `getCanonicalPath`
        - **Dynamic path resolution** via `resolveNotionPage`
    - SEO Architecture
        - **Sitemap generation** via `sitemap.ts`
        - **Meta data extraction** from Notion content
        - **Structured data** implementation
    - Performance Architecture
        - **Code splitting** with dynamic imports
        - **Infinite scroll** for article pagination
        - **Caching strategies** with React Query and Vercel KV

## Key Components

1. **Blog** (`src/containers/blog/index.tsx`)
    - Purpose: 블로그 메인 페이지의 컨테이너 역할
    - Key ****responsibilities**:**
        - SEO 메타데이터 설정
        - 라우팅 정보 전달
        - 주요 콘텐츠 컴포넌트(Articles) 동적 import 및 렌더링
2. **BlogDetail** (`src/containers/blog/blog-detail.tsx`)
    - Purpose: 블로그 상세 페이지(아티클 본문) 렌더링
    - Key responsibilities:
        - SEO 메타데이터 설정
        - Notion 기반 아티클 본문 렌더링

## **Technology Stack**

- Frontend
    - Next.js (v14+, pages router)
    - TypeScript
    - Tailwind CSS
    - React Query (@tanstack/react-query)
    - Jotai (state management)
    - React Notion X (Notion page renderer)
    - Framer Motion, class-variance-authority
- Backend
    - Next.js API Routes (Vercel Serverless Functions)
    - Notion API (@notionhq/client)
- Database
    - Notion Database (콘텐츠 CMS, 버전: Notion API v2022-06-28)
    - Vercel KV (Redis 캐싱, v3+)
- Other tools
    - Vercel (Hosting & CI/CD)
    - Sentry (Error Monitoring)
    - Mixpanel, Hotjar (Analytics)
    - ESLint, Prettier (코드 품질)
    - Github Actions (배포 자동화)

# **Development Environment Setup**

---

## **Prerequisites**

- Required software**:**
    - Node.js (Version 18.x 이상 권장)
    - Yarn (v1.22.x)
    - Git (최신 버전 권장)
    - Vercel CLI (선택, 배포/테스트용)
    - VSCode (권장, 필수 플러그인: Tailwind CSS IntelliSense)
- System requirements**:**
    - macOS, Linux, 또는 Windows 10/11 (64bit)
    - 최소 4GB RAM (8GB 이상 권장)
    - 2+ Core CPU
    - 2GB 이상의 디스크 여유 공간
    - 인터넷 연결 (의존성 설치 및 Notion API, Vercel 연동 필요)

## **Setup Instructions**

1. Clone repositories:
    
    ```
    git clone https://github.com/drtail/drtail-owner-web.git
    ```
    
2. Install dependencies:
    
    ```
    yarn install
    ```
    
3. Configuration:
    - 환경 변수는 git으로 관리되고 있어 로컬에서 configuration 과정 필요 X
    - 로컬에서 환경 변수 추가 시 Vercel에 dev, prod 환경별로 추가 필요

## **Access and Credentials**

- Development environment access:
    - 로컬 개발은 GitHub 저장소(clone) 및 Node.js 환경에서 가능합니다.
    - 별도의 VPN이나 사내망 접근 없이 개발 가능.
    - 코드 저장소: https://github.com/drtail/drtail-owner-web
    - 권한이 필요한 경우 GitHub Organization 관리자에게 요청하세요.
        - Github 개발자 공용 계정: [dev@drtail.us](mailto:dev@drtail.us)
- API keys and tokens:
    - Notion API secret key
        - [dev@drtail.us](mailto:dev@drtail.us) 계정으로 [Notion API](https://developers.notion.com/) 접근
        - View my integrations → Dr.Tail Blog에서 확인 가능
        - Vercel 환경변수로 등록되어 있음

# **Repositories and Version Control**

---

## **Repository Information**

- Main repository: https://github.com/drtail/drtail-owner-web
- Related repositories: -

## **Workflow**

- Branching strategy:
    - 기본 브랜치: `main`
    - 개발 브랜치: `develop`
    - 기능 개발: `develop` 브랜치에서 `drt-1696/change-clarity-to-hotjar` 와 같이 구체적인 네이밍의 브랜치 생성 후 개발.
    - PR 및 배포는 `drt-xxx/asdasd` → `develop` → `main` 순으로 진행
- Code review process:
    1. 모든 변경 사항은 Pull Request(PR)로 제출
    2. 최소 1명 이상의 팀원이 코드 리뷰 및 승인
    3. 리뷰 승인 후 `develop` 또는 `main` 브랜치에 머지
- Release process: [Details]
    - PR 승인 및 머지 후, Github Actions에서 자동으로 배포.
    - develop 브랜치에 머지되면 [dev.drtail.us](http://dev.drtail.us)에 배포됨
    - main 브랜치에 머지되면 [drtail.us](http://drtail.us)에 배포됨

# **Build and Deployment**

---

상단 Workflow 참고

# Testing Strategy

---

- No test code
- 아티클 생성 시 status 프로퍼티를 `dev` 로 설정 후 [dev.drtail.us](http://dev.drtail.us)에서 이슈 없는지 먼저 확인 (by Jade)

# **Known Issues and Technical Debt**

---

## **Current Issues**

| **Issue** | **Impact** | **Workaround** |
| --- | --- | --- |
| Articles 컴포넌트에 비즈니스 로직과 UI 코드가 혼재됨 | 유지보수 및 테스트 어려움, 코드 가독성 저하 | 컨테이너/프리젠테이셔널 분리 리팩토링 필요 |
| Notion DB 스키마 변경 시 취약 | 데이터 구조 변경 시 런타임 에러 발생 가능 | Notion 응답 구조에 대한 타입 명확화 및 예외 처리 강화 |
| API 응답 스키마가 Notion 구조에 종속적 | Notion 구조 변경 시 프론트/백엔드 동시 수정 필요 | API 응답을 별도 DTO로 매핑하여 추상화 |
| 유닛 테스트 및 E2E 테스트 부족 | 장애 사전 탐지 어려움, 코드 신뢰도 저하 | 주요 로직/컴포넌트에 대한 테스트 코드 작성 필요 |

## **Technical Debt**

| **Area** | **Description** | **Priority** |
| --- | --- | --- |
| 컴포넌트 구조 | Articles 컴포넌트에 데이터 패칭, 상태 관리, UI 렌더링이 혼재되어 있음. 컨테이너/프리젠테이셔널 분리 필요 | Low |
| Notion 데이터 구조 의존성 | Notion DB 스키마 변경 시 서버/클라이언트 코드 모두에서 에러 발생 가능성 | High |
| API 응답 스키마 추상화 부족 | Notion API 응답을 그대로 매핑, 데이터 구조 변경 시 영향 범위 큼 | High |
| 테스트 | 주요 비즈니스 로직 및 컴포넌트에 대한 유닛/통합 테스트 부족 | Medium |

# **Documentation and Resources**

---

## **Internal Resources**

- Wiki:
    
    [Dr.Tail Blog (Notion Database 기반)](https://www.notion.so/Dr-Tail-Blog-Notion-Database-20fe6fe543c28012babef399ebe715b7?pvs=21)
    
    [Blog.key](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/Blog.key)
    
- API Documentation:
    - 없음
- Design Documents:
    - [Figma](https://www.figma.com/design/6zV2IvPWA1XW0pwapm8Jm9/Owner-WEB-0.82.8-?node-id=11000-60870&t=fVfrOyIVFrF34Fd4-4)

## **External Resources**

- [Notion API Docs](https://developers.notion.com/reference/intro)

# **Key Contacts and Stakeholders**

---

| **Role** | **Name** | **Contact** | **Responsibilities** |
| --- | --- | --- | --- |
| Product Owner | Jade | [jade@drtail.us](mailto:jade@drtail.us) | 블로그 아티클 생성 및 관리 |
| Tech Lead(future) | (미정) |  | 블로그 관련 개발 이슈 핸들링, 요구사항 점검 및 대응 |

# **Pending Tasks and Next Steps**

---

## **Current Work**

- No pending tasks

| **Task** | **Priority** | **Status** | **Owner** |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |

## **Upcoming Milestones**

- No upcoming tasks

| **Milestone** | **Deadline** | **Dependencies** |
| --- | --- | --- |
|  |  |  |
|  |  |  |

# **Additional Notes**

---

## **Tribal Knowledge**

- Notion DB의 스키마(필드명, 타입 등)가 변경되면 API와 프론트엔드 코드 모두에서 동시 수정이 필요합니다.
    - Code Example
        
        ```tsx
        // API
        const fetchArticles = (req: NextApiRequest, res: NextApiResponse) => {
          ...
          
          const refinedData = rawData.results.map((result: any) => {
              const { id, cover, properties, url } = result;
        
              return {
                id,
                coverImageUrl: cover.file.url,
                metaExcerpt: properties['meta excerpt'].rich_text.at(0)?.plain_text,
                tags: properties.tag.multi_select,
                title: properties.name.title.at(0)?.plain_text,
                appTitle: properties.app_title?.rich_text.at(0)?.plain_text ?? '',
                path: getOriginalPath(url),
                canonicalPath: getCanonicalPath(properties),
              };
            });
            
           ...
        }
        
        // 프론트엔드
        const ArticleCard = ({
          path,
          coverImageUrl,
          title,
          metaExcerpt,
          tags,
        }: Readonly<Article.Level1>) => {
          return (
            <li className="animate-fade-in-400ms motion-reduce:animate-none">
              <Link
                as={path}
                href={`${BLOG_MAIN_PATH}/[pageId]`}
                className="flex flex-col items-start gap-4"
              >
                <div className="relative h-[200px] w-full shrink-0">
                  <Image
                    src={coverImageUrl}
                    alt="cover-image"
                    fill
                    className="!relative rounded-xl bg-extended-alabaster"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="line-clamp-2 text-primary-600 text-title-w-1">
                    {title}
                  </h2>
                  <p className="text-primary-600 text-body-2">{metaExcerpt}</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Tag key={tag.id} size="sm" {...tag} />
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          );
        };
        ```
        
- 개발(local) 환경에서는 status가 'dev' 또는 'prod'인 아티클이 모두 노출되지만, 운영 환경에서는 'prod'만 노출됩니다.
- react-notion-x는 라이브러리 내부적으로 Notion의 Unofficial API를 사용합니다. 해당 API가 내부적으로 수정되면 이슈 발생 가능성이 존재합니다.

## **Tips and Tricks**

- Notion DB의 프로퍼티명(예: 'meta excerpt', 'tag', 'name')은 하드코딩되어 있으므로, Notion에서 프로퍼티명을 변경할 시에는 참조되고 있는 곳들을 면밀히 체크하여 사이드 이펙트가 없는지 잘 확인해야 합니다.
- 무한 스크롤/페이지네이션 구현 시 Notion API의 start_cursor를 적극 활용하면 대용량 데이터도 효율적으로 처리할 수 있습니다. (현재 start_cursor를 이용해 무한스크롤 처리중)
- Notion에서 [Search API](https://developers.notion.com/reference/post-search)를 제공합니다. 검색 기능 도입에 대한 요청이 들어왔을 때 활용할 수 있습니다.
- 구글에서 `site:drtail.us/blog`를 검색하면 색인된 아티클 페이지들을 확인해볼 수 있습니다.
    - 어디까지 얼만큼 크롤링할지 정하는 건 구글 크롤링 봇 마음…😇
- react-notion-x에서 제공하는 UI Renderer는 추상화 레벨이 높아 UI 커스텀이 까다롭습니다. 아래 3가지 정도의 추가 작업을 통해 해결할 수 있습니다. (단점: 품이 많이 듦)
    - react-notion-x를 버리고 UI Parser Custom 제작
    - 쌩 노션이 아닌 Custom Notion CMS 제작
    - Backend에서 Notion API 핸들링
- Vercel KV의 사용량을 주기적으로 체크할 것을 권장합니다. 지금은 문제 없으나, 트래픽이 기하급수적으로 늘거나 아티클의 개수가 증가할 수록 KV 사용량도 비례하여 증가하게 될 수 있습니다. → Vercel 청구 요금이 증가할 수 있습니다.
    - Vercel → drtail-owner-web → 상단 네비게이션에서 Storage → drtail-owner-web-kv → Open in Upstash 순으로 접근할 수 있습니다.
        
        ![image.png](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/image%202.png)
        
- Cron Job 배치 주기 점검 및 Log를 주기적으로 트래킹하는 것을 권장합니다. 이전에 timeout이 발생했던 적이 있어서 페이지네이션 처리 + 에러 발생 시 Sentry 로깅처리를 해두긴 했습니다.
    
    ![image.png](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/image%203.png)
    
    ![image.png](%5BOffboarding%20Doc%5D%20Dr%20Tail%20Blog%20211e6fe543c280df9d68e81bbac71032/image%204.png)
    

## **Lessons Learned**

- 비즈니스 로직과 UI 코드가 한 컴포넌트에 혼재되면 유지보수와 테스트가 어려워지므로, 컨테이너/프리젠테이셔널 분리를 초기에 설계하는 것이 중요합니다.
- 외부 API(특히 Notion) 의존도가 높을 경우, 데이터 구조 변경에 대비한 타입 명확화와 예외 처리, 그리고 API 응답 추상화가 필수적입니다.

## Potential Next Steps

- React Notion X (Renderer) - UI Customizing 이 어렵다. 직접 parser 생성?
    - 제이드가 아티클 본문 중간에 CTA 삽입이 가능한지 물어봤을 때가 있었음 (현재 불가)
    - 화해 블로그 ([https://blog.hwahae.co.kr/all/tech/10960](https://blog.hwahae.co.kr/all/tech/10960)) 참고
    - 내부적으로 비공식 API를 사용하고 있음 → API 변경시 이슈 발생 위험도 있음

# **Approval and Review**

---

## **Current Status**

- Last Reviewed: [Date]
- Reviewed By: [Name/Title]
- Next Review Due: 25.06.19

## **Reviewers**

- @Maggie Choi
- @Sabo Kim
- @Carey Jo

## **Approval**

- Approved By: [Name/Title]
- Approval Date: [Date]