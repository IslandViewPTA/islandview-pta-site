import React from "react";
import format from "date-fns/format";

export default class PostPreview extends React.Component {
  render() {
    const {entry, getAsset, widgetFor} = this.props;
    let image = getAsset(entry.getIn(["data", "image"]));
    let title = entry.getIn(["data", "title"]);
    let postDate = format(entry.getIn(["data", "date"]), "ddd, MMM D, YYYY");
    let summary = entry.getIn(["data", "description"]);

    // Bit of a nasty hack to make relative paths work as expected as a background image here
    if (image && !image.fileObj) {
      image = window.parent.location.protocol + "//" + window.parent.location.host + image;
    }
    else {
      image = null
    }


    return <div class="w-100 center ph3 ph0-l pt5">
    <div class="mw7 center">
    <h1 class="f2 lh-title mb3 primary">{ title }</h1>
    <p><span class="b">Date:</span>{ postDate }</p>
      <div class="mw7 cf pb1">
        <img class="fl w5 mr3" src={ image } alt="Image for {{ .Title }}" />
        <p class="f6 i">{ summary }</p>
      </div>
    </div>
    <div class="mw7 center pt3">
      { widgetFor("body") }
    </div>
    </div>;
  }
}
