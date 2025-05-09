# Discovery+ 分流规则集指南
<details>
<summary>▶ I. 引言</summary>

Discovery+ 作为一个内容丰富的流媒体平台，汇集了来自 HGTV、Food Network、TLC、ID 等多个知名电视频道以及独家原创内容 <sup>1</sup>。为了在特定网络环境下（例如使用代理工具时）优化访问体验、实现区域内容解锁或管理特定类型的网络流量，用户常常需要配置分流规则。本报告旨在提供一套针对主流代理工具 Clash、Surge 和 Quantumult X 的 Discovery+ 分流规则建议，并深入分析相关域名的功能及其在规则配置中的重要性。这些规则集基于社区观察、官方文档以及对流媒体服务通用架构的理解而构建。

随着华纳兄弟探索公司（Warner Bros. Discovery, WBD）对其流媒体技术栈的整合，特别是将 Discovery+迁移至与 Max 相同的技术平台 <sup>3</sup>，其域名和服务端点可能会发生变化。因此，本报告提供的规则集是一个动态的参考，用户需要结合自身使用情况和最新的网络分析进行调整。
</details>

<details>
<summary>▶ II. Discovery+ 域名和流量分析</summary>

理解 Discovery+ 服务所依赖的各类域名及其功能，是构建有效分流规则的基础。这些域名大致可分为核心服务域名、内容分发网络（CDN）域名、第三方关键服务域名以及遥测与分析域名。

<details>
<summary>▶ A. 核心服务域名</summary>

这些域名是保证 Discovery+ 应用正常启动、用户认证、API 调用和内容索引等核心功能所必需的。

**认证与账户管理域名:**
* `discoveryplus.com`: Discovery+ 的主域名，用于访问服务和信息展示 <sup>1</sup>。
* `auth.discoveryplus.com`: 负责用户身份验证和授权流程 <sup>1</sup>。如果代理导致登录问题，部分用户可能会选择将此域名设置为 DIRECT。
* `prod-direct.discoveryplus.com`: 另一个与生产环境直接相关的域名，可能涉及核心服务通信 <sup>7</sup>。同样，根据实际情况可能需要调整代理策略。

**API 接口域名:**
* `disco-api.com` 或 `disco-api.discoveryplus.com`: 提供应用内数据交互、内容元数据获取等服务的 API 端点。社区观察到 `disco-api.com` 的使用 <sup>8</sup>，而 `disco-api.discoveryplus.com` 可能是更具体的 API 服务地址。`api.csdisco.com` 似乎属于另一家名为 DISCO 的电子取证和法律技术公司，与 Discovery+ 流媒体服务无关 <sup>9</sup>。
* `dnitv.com`: 一个与 Discovery Networks 早期相关的域名，可能仍在某些旧版应用或特定地区服务中被调用 <sup>2</sup>。

**流媒体清单与内容初始化:**
* `*.prod-vod.h264.io`: 例如 `dplus-northamerica-cloudfront-gcs.prod-vod.h264.io`，这类域名用于提供 H.264 编码的视频点播（VOD）内容的生产环境清单文件或初始化数据 <sup>11</sup>。这是视频开始播放的关键环节。
</details>

<details>
<summary>▶ B. 内容分发网络 (CDN) 域名</summary>

Discovery+ 利用 WBD 自有 CDN 及多个第三方 CDN 来分发视频内容、图片、应用更新等静态和动态资源，以确保全球用户的访问速度和稳定性。WBD 的流媒体服务，包括 Max 和 Discovery+，采用多 CDN 策略，常见的合作伙伴包括 Akamai、AWS CloudFront、Fastly 和 Google Media CDN <sup>12</sup>。

**WBD 自有 CDN 及相关域名:**
* `static-wbd-cdn.wbd.com`: 用于托管华纳兄弟探索公司的静态资源，如图片、CSS、JavaScript 文件，甚至法律条款文档等 <sup>17</sup>。
* `dl.discoveruplus.com`: 可能用于应用更新包下载或其他大型文件分发 <sup>1</sup>。

**第三方 CDN 通用模式及域名:**
由于 CDN 服务商通常会为其客户（如 WBD）分配特定的子域名或路径，直接列出所有可能的 CDN 域名非常困难。因此，采用 DOMAIN-KEYWORD 规则匹配 CDN 服务商的主域名，并结合一些已知的通用客户域名后缀，是更有效的方法。

* **Akamai**:
    * 关键词: `akamai`
    * 后缀: `akamaiedge.net`, `akamaihd.net` <sup>20</sup>
* **Amazon CloudFront**:
    * 关键词: `cloudfront`
    * 后缀: `cloudfront.net` <sup>24</sup>
* **Fastly**:
    * 关键词: `fastly`
    * 后缀: `fastly.net`, `freetls.fastly.net`, `edgecompute.app` <sup>29</sup>
* **Google Media CDN / Google Cloud CDN**:
    * 关键词: `googleusercontent`, `googlevideo` <sup>15</sup>

WBD 的 CDN 合作伙伴还可能包括 Edgio (前 Limelight) <sup>14</sup>，但鉴于其近期业务调整，其在 WBD 服务中的活跃度有待观察。

**CDN 域名策略的重要性:** 对于 CDN 域名，使用 DOMAIN-KEYWORD (如 `akamai`, `fastly`) 通常比尝试列出所有可能的 `customer-specific-subdomain.akamaihd.net` 更为有效和简洁。这是因为 CDN 服务商会为客户生成大量此类特定子域名。然而，过于宽泛的关键词也可能误伤其他不相关的服务，因此需要谨慎选择。例如，仅使用 `google` 作为关键词则过于宽泛。
</details>

<details>
<summary>▶ C. 第三方关键服务域名</summary>

这些域名提供对 Discovery+ 应用功能至关重要的辅助服务，如数字版权管理（DRM）、Cookie 同意管理和必要的 JavaScript 库。

* **`*.conax.cloud`** (例如 `discovery-us.conax.cloud`):
    * **功能**: 数字版权管理 (DRM)。Conax 是一家提供内容安全解决方案的公司，其技术被用于保护数字电视和流媒体内容 <sup>41</sup>。Discovery+ 使用 `conax.cloud` 相关域名进行 DRM 验证。
    * **重要性**: 极其重要。如果阻止此类域名，将导致视频无法解密和播放 <sup>43</sup>。
    * **建议策略**: DIRECT。DRM 服务通常需要直接且低延迟的连接。
* **`cdn.cookielaw.org`**:
    * **功能**: Cookie 同意管理平台 (CMP) 的一部分，由 OneTrust 提供。许多网站和应用使用此服务来处理用户对 Cookie 使用的同意，以符合 GDPR 等隐私法规 <sup>45</sup>。
    * **重要性**: 极其重要。阻止此域名可能导致应用界面无法正常加载、卡在隐私声明页面或无法进行用户登录等操作 <sup>48</sup>。
    * **建议策略**: DIRECT。
* **`*.jsdelivr.net`**:
    * **功能**: 一个免费的开源 CDN，用于托管 npm 和 GitHub 等项目的 JavaScript 库、CSS 文件等静态资源 <sup>51</sup>。Discovery+ 应用可能依赖其加载某些前端库。
    * **重要性**: 可能重要。如果应用前端依赖此 CDN 上的资源，阻止它可能导致功能异常或界面显示问题 <sup>55</sup>。
    * **建议策略**: DIRECT。
</details>

<details>
<summary>▶ D. 遥测、分析及广告域名</summary>

这些域名用于收集应用使用数据、性能指标、崩溃报告以及投放广告。用户可以根据自己的隐私偏好决定如何处理这些域名。

* **`*.newrelic.com`** (例如 `mobile-collector.newrelic.com`, `js-agent.newrelic.com`):
    * **功能**: New Relic 提供的应用性能监控 (APM) 和遥测数据收集服务 <sup>56</sup>。
    * **重要性**: 对核心功能通常不重要，但某些情况下，如果应用强依赖其初始化，阻止可能导致启动问题或功能异常 <sup>43</sup>。
    * **建议策略**: REJECT (阻止) 或 DIRECT (如果阻止导致问题)。
* **`*.mparticle.com`**:
    * **功能**: 客户数据平台 (CDP)，用于收集和管理用户数据，进行分析和营销 <sup>58</sup>。
    * **重要性**: 对核心功能不重要。
    * **建议策略**: REJECT。

**处理遥测域名的平衡**: 用户通常希望最大限度地阻止跟踪和广告，但这有时会与依赖这些第三方域名进行基本操作（如 Cookie 同意、DRM）的 Discovery+ 等服务的功能发生冲突。规则集必须平衡这些需求，通常建议对关键的第三方域名使用 DIRECT 策略。
</details>

<details>
<summary>▶ E. 区域特定域名</summary>

Discovery+ 在不同国家和地区提供服务，并可能使用区域特定的域名。
* `discoveryplus.in`: 印度地区服务域名 <sup>7</sup>。
* `discoveryplus.co.uk`: 英国地区服务域名 <sup>8</sup>。
* 其他欧洲国家也可能有特定域名或通过 `discoveryplus.com` 的区域化子服务提供 <sup>61</sup>。

**区域域名的关键性**: 仅依赖通用的 `.com` 域名规则是不够的。必须包含区域顶级域名（ccTLD，如 `.in`, `.co.uk`）以及可能的区域特定 API/CDN 端点，以确保这些地区用户或希望访问这些地区内容的用户能够正常使用服务。
</details>
</details>
