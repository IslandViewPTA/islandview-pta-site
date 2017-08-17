import React from "react";
import CMS from "netlify-cms";

import NewsPreview from "./cms-preview-templates/news";
import ProductsPreview from "./cms-preview-templates/products";


// Example of creating a custom color widget
class ColorControl extends React.Component {
  render() {
    return <input
        style={{height: "80px"}}
        type="color"
        value={this.props.value}
        onInput={(e) => this.props.onChange(e.target.value)}
    />;
  }
}

CMS.registerPreviewStyle("/css/tachyons.css");
CMS.registerPreviewTemplate("news", NewsPreview);
CMS.registerPreviewTemplate("products", ProductsPreview);
CMS.registerWidget("color", ColorControl);
