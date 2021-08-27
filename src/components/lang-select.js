import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import cnFlag from "../images/cn_flag.png";
import usFlag from "../images/us_flag.png";

const LangSelect = ({ value }) => {
  const handleChange = (option) => {
    const langKey = option.value;

    const path = window.location.pathname;
    if (path === "/") {
      navigate(`/${langKey}/index`);
    } else {
      // Example: path === "/en/blog/fluidex-architecture/"
      // path.split("/") === ["", "en", "blog", "fluidex-architecture", ""]
      // path.split("/").slice(2) === ["blog", "fluidex-architecture", ""]
      // path.split("/").slice(2).join("/") === "/blog/fluidex-architecture/"
      navigate(`/${langKey}/${path.split("/").slice(2).join("/")}`);
    }
  };

  const styles = {
    control: (base) => ({
      ...base,
      height: 35,
      width: 150,
    }),
  };

  const options = [
    {
      value: "en",
      label: <div style={{ display: "flex" }}>English</div>,
    },
    {
      value: "zh",
      label: <div style={{ display: "flex" }}>简体中文</div>,
    },
  ];

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select
      value={selectedOption}
      onChange={(e) => handleChange(e)}
      options={options}
      styles={styles}
    ></Select>
  );
};

export default LangSelect;
