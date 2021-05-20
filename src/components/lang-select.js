import React from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import Select from "react-select";

import cnFlag from "../images/cn_flag.png";
import usFlag from "../images/us_flag.png";

const LangSelect = ({ value }) => {
  const { i18n } = useTranslation();

  const handleChange = (option) => {
    const langKey = option.value;
    i18n.changeLanguage(langKey);

    const path = window.location.pathname;
    if (path === "/") {
      navigate(`/${langKey}/index`);
    } else {
      navigate(`/${langKey}/${path.split("/")[2]}`);
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
      label: (
        <div style={{ display: "flex" }}>
          <img src={usFlag} alt="US Flag" /> English
        </div>
      ),
    },
    {
      value: "zh",
      label: (
        <div style={{ display: "flex" }}>
          <img src={cnFlag} alt="CN Flag" /> 简体中文
        </div>
      ),
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
