import React from "react";
import { Link } from "gatsby";

const LinkWithLang = ({ langKey, to, ...restProps }) => {
  return <Link to={`/${langKey}${to}`} {...restProps} />;
};

export default LinkWithLang;
