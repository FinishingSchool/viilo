var React = require('react');

var Overlay = React.createClass({
  propTypes: {
    toggle: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
  },
  render: function() {
    var traits = makeTraits(this.props);
    var toggle = this.props.toggle;
    var overlayTitle = this.props.title;

    return (
      <div data-overlay={traits} onClick={toggle}>
        <div className="bounds" onClick={this.nullClick}>
          <div data-layout="overlay">
            <div data-area="title">
              <div className="wrapper">
                <h2 className="double-pica">{overlayTitle}</h2>
              </div>
            </div>
            <div data-area="close">
              <div className="wrapper">
                <button onClick={toggle}>Close</button>
              </div>
            </div>
            <main data-area="main">
              <div className="wrapper scroll-box">
                {this.props.children}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  },
  nullClick: function(e) {
    e.stopPropagation();
  }
});

var makeTraits = function(props) {
  var traits = [];

  if (props.active) {
    traits.push('active');
  }

  return traits.join(' ');
}

module.exports = Overlay;
