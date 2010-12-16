/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 * 
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 * 
 * The Original Code is dict.js.
 * 
 * The Initial Developer of the Original Code is
 * the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 * 
 * Contributor(s):
 *   Siddharth Agarwal <sid.bugzilla@gmail.com>
 * 
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

"use strict";

var EXPORTED_SYMBOLS = ["Dict"];

/**
 * Transforms a given key into a property name guaranteed not to collide with
 * any built-ins.
 */
function convert(aKey) {
  return ":" + aKey;
}

/**
 * Transforms a property into a key suitable for providing to the outside world.
 */
function unconvert(aProp) {
  return aProp.substr(1);
}

function Dict(aInitial) {
  if (aInitial === undefined)
    aInitial = {};
  this._items = {};
  for (let [key, val] in Iterator(aInitial))
    this._items[convert(key)] = val;
  return Object.freeze(this);
}

Dict.prototype = Object.freeze({
  /**
   * Gets the value for a key from the dictionary.
   */
  get: function Dict_get(aKey) {
    let prop = convert(aKey);
    return this._items[prop];
  },

  /**
   * Sets the value for a key in the dictionary.
   */
  set: function Dict_set(aKey, aValue) {
    this._items[convert(aKey)] = aValue;
  },

  /**
   * Returns whether a key is in the dictionary.
   */
  has: function Dict_has(aKey) {
    return (convert(aKey) in this._items);
  },

  /**
   * Deletes a key from the dictionary.
   *
   * @returns true if the key was found, false if it wasn't.
   */
  del: function Dict_del(aKey) {
    let prop = convert(aKey);
    if (prop in this._items) {
      delete this._items[prop];
      return true;
    }
    return false;
  },

  /*
   * List and iterator functions
   *
   * No guarantees whatsoever are made about the order of elements.
   */

  /**
   * Returns a list of all the keys in the dictionary in an arbitrary order.
   */
  listkeys: function Dict_listkeys() {
    return [unconvert(k) for (k in this._items)];
  },

  /**
   * Returns a list of all the values in the dictionary in an arbitrary order.
   */
  listvalues: function Dict_listvalues() {
    let items = this._items;
    return [items[k] for (k in items)];
  },

  /**
   * Returns a list of all the items in the dictionary as key-value pairs
   * in an arbitrary order.
   */
  listitems: function Dict_listitems() {
    let items = this._items;
    return [[unconvert(k), items[k]] for (k in items)];
  },

  /**
   * Returns an iterator over all the keys in the dictionary in an arbitrary
   * order.
   */
  get keys() {
    // If we don't capture this._items here then the this-binding will be
    // incorrect when the generator is executed
    let items = this._items;
    return (unconvert(k) for (k in items));
  },

  /**
   * Returns an iterator over all the values in the dictionary in an arbitrary
   * order.
   */
  get values() {
    // If we don't capture this._items here then the this-binding will be
    // incorrect when the generator is executed
    let items = this._items;
    return (items[k] for (k in items));
  },

  /**
   * Returns an iterator over all the items in the dictionary as key-value pairs
   * in an arbitrary order.
   */
  get items() {
    // If we don't capture this._items here then the this-binding will be
    // incorrect when the generator is executed
    let items = this._items;
    return ([unconvert(k), items[k]] for (k in items));
  },

  /**
   * Returns a string representation of this dictionary.
   */
  toString: function Dict_toString() {
    return "{" +
      [(key + ": " + val) for ([key, val] in this.items)].join(", ") +
      "}";
  },
});
