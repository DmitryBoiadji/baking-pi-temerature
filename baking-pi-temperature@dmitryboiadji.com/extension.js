const GETTEXT_DOMAIN = 'baking-pi-temperature';
const {GObject, St, Clutter, GLib, Gio, Soup, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Me = ExtensionUtils.getCurrentExtension();


const _ = ExtensionUtils.gettext;
let buttonText;
let prometheusUrl;

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {


        _setButtonText() {
            try {

                let httpSession = new Soup.Session();
                let url =  prometheusUrl + '/api/v1/query?query=node_thermal_zone_temp';
                let message = Soup.Message.new('GET', url);
                message.request_headers.set_content_type("application/json", null);
                message.set_request('application/json', 2, '{}');
                httpSession.queue_message(message, function (_httpSession, message) {

                    let out = null;
                    let temperatureData = JSON.parse(message.response_body.data);
                    if (temperatureData) {
                        out = temperatureData.data.result[0].value[1];
                        out = parseFloat(out).toFixed(1);
                    }
                    buttonText.set_text(out + ' °C');

                })

            } catch (e) {
                reject(e);
                log(e);
            }
        }


        _init() {
            super._init(0.0, _('Init ready'));

            let topBox = new St.BoxLayout({
                style_class: 'panel-status-menu-box'
            });

            topBox.add_child(new St.Icon({
                gicon: Gio.icon_new_for_string(Me.path + '/icons/raspberry-pi.svg'),
                style_class: 'pi-icon',
            }));

            buttonText = new St.Label({
                text: '...',
                style_class: 'pi-label',
                y_align: Clutter.ActorAlign.CENTER,
                y_expand: true
            });

            topBox.add_child(buttonText);
            this.add_child(topBox);

        }
    });

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        this._timeoutId = null;
        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        let self = this;


        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.baking-pi-temperature');
        prometheusUrl =  this.settings.get_string('prometheus-url');


        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_LOW,
            15, () => {
                self._indicator._setButtonText();
                return GLib.SOURCE_CONTINUE;
            });
        Main.panel.addToStatusArea(this._uuid, this._indicator);



    }

    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
