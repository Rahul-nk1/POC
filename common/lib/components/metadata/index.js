import { Helmet } from "react-helmet";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import * as M from "@discovery/prelude/lib/data/maybe";
export const Metadata = ({ data = {
    title: M.empty(),
    description: M.empty(),
    keywords: M.empty(),
    author: M.empty(),
    image: M.empty(),
}, }) => (<>
    <Helmet>
      <meta property="og:url" content={window.location.href}/>
    </Helmet>
    <RenderMaybe>
      {M.map((title) => title && (<Helmet>
              <title>{title}</title>
              <meta property="og:title" content={title}/>
              <meta name="twitter:title" content={title}/>
            </Helmet>), data.title)}
      {M.map((description) => description && (<Helmet>
              <meta name="description" content={description}/>
              <meta property="og:description" content={description}/>
              <meta name="twitter:description" content={description}/>
            </Helmet>), data.description)}
      {M.map((image) => (<Helmet>
            <meta property="og:type" content="video.episode"/>
            <meta property="og:image" content={`${image}?w=600`}/>
            <meta name="twitter:image" content={`${image}?w=600`}/>
          </Helmet>), data.image)}
      {M.map((keywords) => (<Helmet>
            <meta name="keywords" content={keywords}/>
          </Helmet>), data.keywords)}
      {M.map((author) => (<Helmet>
            <meta name="author" content={author}/>
          </Helmet>), data.author)}
    </RenderMaybe>
  </>);
//# sourceMappingURL=index.js.map