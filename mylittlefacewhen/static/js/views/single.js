// Generated by CoffeeScript 1.3.3

window.SingleView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    var _this = this;
    this.template = tpl.get('single');
    this.model.on("change", function() {
      return _this.render();
    });
    if (this.model.isNew() && !this.options.firstLoad) {
      this.model.fetch();
    }
    return $(window).scrollTop(0);
  },
  events: {
    "click .tag": "navigateAnchor",
    "focus #controls div": "activate",
    "blur #controls div": "deactivate",
    "click #editbutton": "editInfo",
    "click .window .close": "cancel",
    "click #mask": "cancel",
    "click #single": "random",
    "click .window .report": "report",
    "submit form": "saveInfo",
    "click #flag": "showWindow"
  },
  beforeClose: function() {
    return this.model.off("change");
  },
  render: function() {
    var current_scroll, face, image, resizes, thumb, to_template;
    if (!this.model.isNew()) {
      $("#loader").hide();
      current_scroll = $(window).scrollTop();
      face = this.model.toJSON();
      image = this.model.getImage();
      thumb = this.model.getThumb(false, true);
      if (face.source) {
        face.source = [
          {
            source: face.source
          }
        ];
      } else {
        face.source = [];
      }
      resizes = [];
      if (face.resizes.huge) {
        resizes.push({
          size: "huge",
          image: face.resizes.huge
        });
      }
      if (face.resizes.large) {
        resizes.push({
          size: "large",
          image: face.resizes.large
        });
      }
      if (face.resizes.medium) {
        resizes.push({
          size: "medium",
          image: face.resizes.medium
        });
      }
      if (face.resizes.small) {
        resizes.push({
          size: "small",
          image: face.resizes.small
        });
      }
      face.resizes = resizes;
      this.updateMeta(face);
      to_template = {
        artist: face.artist,
        face: face,
        image: image,
        static_prefix: static_prefix,
        thumb: thumb,
        image_service: app.getImageService()
      };
      this.$el.html(Mustache.render(this.template, to_template));
      $(".single").css("max-height", screen.height);
      setTimeout(function() {
        return $(window).scrollTop(current_scroll);
      }, 300);
    }
    return this;
  },
  updateMeta: function(face) {
    var canonical, image_src;
    $("title").html(face.title + " - MyLittleFaceWhen");
    $("meta[name=description]").attr("content", face.description);
    $("#og-image").attr("content", face.image);
    if ($("#cd-layout") === []) {
      $("head").append("<meta id='#cd-layout' poperty='cd:layout' content='banner'>");
    }
    image_src = $("link[rel=image_src]");
    if (image_src === []) {
      $("head").append("<link rel='image_src' href='" + face.image + "'>");
    } else {
      image_src.attr("href", face.image);
    }
    canonical = $("link[rel=canonical]");
    if (canonical === []) {
      return $("head").append("<link rel='canonical' href='http://mylittlefacewhen.com/f/" + face.id + "/'>");
    } else {
      return canonical.attr("href", "http://mylittlefacewhen.com/f/" + face.id + "/");
    }
  },
  activate: function(event) {
    return $(event.currentTarget).addClass("activated");
  },
  cancel: function(event) {
    event.preventDefault();
    return $("#mask, .window").hide();
  },
  deactivate: function(event) {
    return $(event.currentTarget).removeClass("activated");
  },
  editInfo: function(event) {
    this.$el.find("#info-show").hide();
    this.$el.find("#info-edit").show();
    return $(document).scrollTop($(document).height());
  },
  random: function(event) {
    event.preventDefault();
    this.undelegateEvents();
    this.$el.html("<div id='loader'><img src='/static/dash.gif' /></div>");
    $("#loader").show();
    return app.random();
  },
  report: function(event) {
    var reason;
    event.preventDefault();
    reason = $(".window textarea").val().replace("\n", "\\n");
    if (!reason) {
      return;
    }
    this.undelegateEvents();
    return $.ajax({
      type: "POST",
      url: "/api/v2/flag/",
      contentType: "application/json; charset=utf-8",
      data: '{"reason":"' + reason + '"}',
      processData: false,
      success: function() {
        return app.navigate("/f/1221/", true);
      },
      error: function() {
        var info;
        info = $(".window h2");
        info.css("color", "black").css("background-color", "red");
        return info.html("An error has ocurred with this report !");
      }
    });
  },
  saveInfo: function(event) {
    var save, source, submit_tags, tag, tags, _i, _len,
      _this = this;
    event.preventDefault();
    $("#loader").show();
    this.$el.find("#info-edit").hide();
    source = event.currentTarget[1].value;
    tags = event.currentTarget[0].value.split(",");
    submit_tags = [];
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      submit_tags.push({
        name: $.trim(tag)
      });
    }
    save = function() {
      return _this.model.save({
        tags: submit_tags,
        source: source
      }, {
        wait: true
      });
    };
    if (this.model.isNew()) {
      return this.model.fetch({
        success: function() {
          return save();
        }
      });
    } else {
      return save();
    }
  },
  showWindow: function(event) {
    var id, winH, winW;
    id = "#dialog";
    winH = $(window).height();
    winW = $(window).width();
    $("#mask").css({
      width: winW,
      height: winH
    }).show();
    return $(id).css({
      top: winH / 3,
      left: winW / 2 - $(id).width() / 2
    }).show();
  }
});
