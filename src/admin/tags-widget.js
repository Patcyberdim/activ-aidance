// Champ « Tags » de l'espace d'écriture : propose les tags déjà utilisés
// (liste lue dans /tags.json) et permet d'en créer de nouveaux.
(function () {
  var h = window.h;
  var createClass = window.createClass;

  var chipStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px", margin: "0 8px 8px 0",
    padding: "4px 12px", borderRadius: "999px", fontSize: "14px", cursor: "pointer",
    border: "1px solid #c9cfe0", background: "#fff", color: "#1b2233"
  };
  var chosenStyle = Object.assign({}, chipStyle, {
    background: "#1f3a93", borderColor: "#1f3a93", color: "#fff"
  });
  var hintStyle = { fontSize: "13px", color: "#5f6577", margin: "10px 0 6px" };

  function toArray(value) {
    if (!value) return [];
    return value.toJS ? value.toJS() : Array.prototype.slice.call(value);
  }

  var TagsControl = createClass({
    getInitialState: function () {
      return { text: "", known: [] };
    },

    componentDidMount: function () {
      var self = this;
      fetch("/tags.json")
        .then(function (r) { return r.json(); })
        .then(function (list) { self.setState({ known: list }); })
        .catch(function () { /* pas de liste : on peut quand même saisir des tags */ });
    },

    add: function (raw) {
      var tag = (raw || "").trim();
      if (!tag) return;
      var current = toArray(this.props.value);
      var lower = tag.toLowerCase();
      // Réutilise l'écriture d'un tag existant (mêmes majuscules/accents).
      var existing = this.state.known.concat(current).filter(function (t) {
        return t.toLowerCase() === lower;
      })[0];
      tag = existing || tag;
      if (current.indexOf(tag) === -1) this.props.onChange(current.concat([tag]));
      this.setState({ text: "" });
    },

    remove: function (tag) {
      this.props.onChange(toArray(this.props.value).filter(function (t) { return t !== tag; }));
    },

    render: function () {
      var self = this;
      var current = toArray(this.props.value);
      var available = this.state.known.filter(function (t) { return current.indexOf(t) === -1; });

      return h("div", { className: this.props.classNameWrapper, id: this.props.forID },
        h("div", {},
          current.length
            ? current.map(function (tag) {
                return h("button", {
                  key: tag, type: "button", style: chosenStyle,
                  title: "Retirer ce tag", onClick: function () { self.remove(tag); }
                }, tag + "  ✕");
              })
            : h("p", { style: hintStyle }, "Aucun tag choisi.")
        ),
        available.length
          ? h("div", {},
              h("p", { style: hintStyle }, "Tags déjà utilisés (cliquer pour ajouter) :"),
              available.map(function (tag) {
                return h("button", {
                  key: tag, type: "button", style: chipStyle,
                  onClick: function () { self.add(tag); }
                }, "+ " + tag);
              })
            )
          : null,
        h("p", { style: hintStyle }, "Créer un nouveau tag :"),
        h("div", { style: { display: "flex", gap: "8px" } },
          h("input", {
            type: "text", value: this.state.text, placeholder: "Nouveau tag…",
            style: { flex: 1 },
            onChange: function (e) { self.setState({ text: e.target.value }); },
            onKeyDown: function (e) {
              if (e.key === "Enter") { e.preventDefault(); self.add(self.state.text); }
            }
          }),
          h("button", {
            type: "button", style: chipStyle,
            onClick: function () { self.add(self.state.text); }
          }, "Ajouter")
        )
      );
    }
  });

  var TagsPreview = createClass({
    render: function () {
      return h("div", {}, toArray(this.props.value).join(", "));
    }
  });

  CMS.registerWidget("etiquettes", TagsControl, TagsPreview);
})();
