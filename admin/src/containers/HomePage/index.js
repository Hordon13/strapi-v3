/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { get, upperFirst } from "lodash";
import { auth, LoadingIndicatorPage } from "strapi-helper-plugin";
import PageTitle from "../../components/PageTitle";
import { useModels } from "../../hooks";

import { ALink, Block, Container, P, Separator } from "./components";
import SocialLink from "./SocialLink";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    link: "https://github.com/strapi/strapi/",
  },
  {
    name: "Discord",
    link: "https://discord.strapi.io/",
  },
  {
    name: "Reddit",
    link: "https://www.reddit.com/r/Strapi/",
  },
  {
    name: "Twitter",
    link: "https://twitter.com/strapijs",
  },
  {
    name: "Blog",
    link: "https://strapi.io/blog",
  },
  {
    name: "Forum",
    link: "https://forum.strapi.io",
  },
  {
    name: "Careers",
    link: "https://strapi.io/careers",
  },
];

const News = ({ headline }) => {
  return (
    <a href={headline.url} target="_blank" style={{ color: "black" }}>
      <div>
        <h3>{headline.title.substr(0, headline.title.lastIndexOf("-"))}</h3>
        <p>{headline.description}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "gray",
          }}
        >
          <p>{headline.source.name}</p>
          <p>{new Date(headline.publishedAt).toLocaleString("hu-HU")}</p>
        </div>
      </div>

      <Separator style={{ marginTop: 5, marginBottom: 25 }} />
      {/* <img src={headline.urlToImage} alt="" /> */}
    </a>
  );
};

const HomePage = ({ history: { push } }) => {
  const createNewUser = (e) => {
    e.preventDefault();
    push(
      "plugins/content-manager/collectionType/plugins::users-permissions.user/create"
    );
  };

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const fetchNews = () => {
    setNewsLoading(true);
    fetch(
      "https://newsapi.org/v2/top-headlines?country=hu&apiKey=e234af45fc4441e781549e582a516964"
    )
      .then((res) => res.json())
      .then((res) => setNews(res))
      .catch((err) => {
        console.error(err);
        setNewsLoading(false);
      })
      .finally(() => setNewsLoading(false));
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      fetchNews();
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  const { isLoading: isLoadingForModels } = useModels();

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const headerId = "HomePage.greetings";
  const username = get(auth.getUserInfo(), "firstname", "");

  const linkProps = {
    id: "app.components.HomePage.create",
    href: "",
    onClick: createNewUser,
    type: "documentation",
  };

  return (
    <>
      {/* title of the home tab */}
      <FormattedMessage id="HomePage.helmet.title">
        {() => <PageTitle title={"HORDON"} />}
      </FormattedMessage>

      <Container className="container-fluid">
        <div className="row" style={{ maxWidth: "1200px" }}>
          <div className="col-lg-7 col-md-12">
            <Block>
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {() => (
                  <h2
                    id="mainHeader"
                    style={{ fontSize: "2.5rem" }}
                  >{`Szia ${username}!`}</h2>
                )}
              </FormattedMessage>
              <FormattedMessage id="app.components.HomePage.welcomeBlock.content.again">
                {() => <P>{`Welcome text goes here yo`}</P>}
              </FormattedMessage>

              <FormattedMessage id={linkProps.id}>
                {() => (
                  <ALink
                    rel="noopener noreferrer"
                    {...linkProps}
                    style={{ verticalAlign: " bottom", marginBottom: 5 }}
                  >
                    {"create new user"}
                  </ALink>
                )}
              </FormattedMessage>
              <FormattedMessage id={linkProps.id}>
                {() => (
                  <ALink
                    rel="noopener noreferrer"
                    {...linkProps}
                    style={{
                      verticalAlign: " bottom",
                      marginBottom: 5,
                      marginLeft: 20,
                    }}
                  >
                    {"create new user"}
                  </ALink>
                )}
              </FormattedMessage>
              <Separator style={{ marginTop: 37, marginBottom: 30 }} />
              <h2 style={{ marginBottom: 36, fontSize: "2.5rem" }}>
                Latest news
              </h2>
              {!newsLoading ? (
                news.articles
                  .slice(0, 10)
                  .map((headline) => (
                    <News headline={headline} key={headline.title} />
                  ))
              ) : (
                <p>loading....</p>
              )}
            </Block>
          </div>

          <div className="col-md-12 col-lg-4">
            <Block style={{ paddingRight: 30, paddingBottom: 0 }}>
              <FormattedMessage id="HomePage.community">
                {(msg) => <h2>{msg}</h2>}
              </FormattedMessage>
              <FormattedMessage id="app.components.HomePage.community.content">
                {(content) => (
                  <P style={{ marginTop: 7, marginBottom: 0 }}>{content}</P>
                )}
              </FormattedMessage>
              <FormattedMessage id="HomePage.roadmap">
                {(msg) => (
                  <ALink
                    rel="noopener noreferrer"
                    href="https://portal.productboard.com/strapi/1-public-roadmap/tabs/2-under-consideration"
                    target="_blank"
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>

              <Separator style={{ marginTop: 18 }} />
              <div
                className="row social-wrapper"
                style={{
                  display: "flex",
                  margin: 0,
                  marginTop: 36,
                  marginLeft: -15,
                }}
              >
                {SOCIAL_LINKS.map((value, key) => (
                  <SocialLink key={key} {...value} />
                ))}
              </div>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
