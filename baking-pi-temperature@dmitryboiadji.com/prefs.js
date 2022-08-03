'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.baking-pi-temperature');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: 'Prometheus api url' });
    group.add(row);


    let prometheusUrl = settings.get_string('prometheus-url');

    //settings.set_string('dock-position', 3);


    // Create the switch and bind its value to the `show-indicator` key
    const entry = new Gtk.Entry({
        text: prometheusUrl,
        valign: Gtk.Align.CENTER,
    });


    settings.bind('prometheus-url',
        entry,
        prometheusUrl,
        Gio.SettingsBindFlags.DEFAULT);


    // Add the switch to the row
    row.add_suffix(entry);
    row.activatable_widget = entry;


    //
    // settings.bind(
    //     'prometheus-url',
    //     prometheusUrl,
    //     '',
    //     Gio.SettingsBindFlags.DEFAULT
    // );


    // Add our page to the window
    window.add(page);
}