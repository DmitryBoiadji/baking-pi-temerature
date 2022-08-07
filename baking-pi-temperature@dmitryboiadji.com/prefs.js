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



    // Create the switch and bind its value to the `show-indicator` key
    const entry = new Gtk.Entry({
        text:  settings.get_string('prometheus-url'),
        valign: Gtk.Align.CENTER,
    });

    entry.activate =
    settings.bind(
        'prometheus-url',
        entry,
        'text',
        Gio.SettingsBindFlags.DEFAULT);

    // Add the switch to the row
    row.add_suffix(entry);
    row.activatable_widget = entry;


    // Add our page to the window
    window.add(page);
}