(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.datatable = {}),global.ng.core,global.common,global.forms));
}(this, (function (exports,core,common,forms) { 'use strict';

var DataTableColumn = /** @class */ (function () {
    function DataTableColumn() {
        this.sortable = false;
        this.resizable = false;
        this.visible = true;
        this.styleClassObject = {}; // for [ngClass]
    }
    DataTableColumn.prototype.getCellColor = function (row, index) {
        if (this.cellColors !== undefined) {
            return this.cellColors(row.item, row, this, index);
        }
    };
    DataTableColumn.prototype.ngOnInit = function () {
        this._initCellClass();
    };
    DataTableColumn.prototype._initCellClass = function () {
        if (!this.styleClass && this.property) {
            if (/^[a-zA-Z0-9_]+$/.test(this.property)) {
                this.styleClass = 'column-' + this.property;
            }
            else {
                this.styleClass = 'column-' + this.property.replace(/[^a-zA-Z0-9_]/g, '');
            }
        }
        if (this.styleClass != null) {
            this.styleClassObject = (_a = {},
                _a[this.styleClass] = true,
                _a);
        }
        var _a;
    };
    DataTableColumn.decorators = [
        { type: core.Directive, args: [{
                    selector: 'data-table-column'
                },] },
    ];
    /** @nocollapse */
    DataTableColumn.ctorParameters = function () { return []; };
    DataTableColumn.propDecorators = {
        'header': [{ type: core.Input },],
        'sortable': [{ type: core.Input },],
        'resizable': [{ type: core.Input },],
        'property': [{ type: core.Input },],
        'styleClass': [{ type: core.Input },],
        'cellColors': [{ type: core.Input },],
        'width': [{ type: core.Input },],
        'visible': [{ type: core.Input },],
        'cellTemplate': [{ type: core.ContentChild, args: ['dataTableCell',] },],
        'headerTemplate': [{ type: core.ContentChild, args: ['dataTableHeader',] },],
    };
    return DataTableColumn;
}());

var ROW_TEMPLATE = "\n<tr\tclass=\"data-table-row\"\n    [title]=\"getTooltip()\"\n    [style.background-color]=\"dataTable.getRowColor(item, index, _this)\"\n    [class.row-odd]=\"index % 2 === 0\"\n    [class.row-even]=\"index % 2 === 1\"\n    [class.selected]=\"selected\"\n    [class.clickable]=\"dataTable.selectOnRowClick\"\n    (dblclick)=\"dataTable.rowDoubleClicked(_this, $event)\"\n    (click)=\"dataTable.rowClicked(_this, $event)\"\n    >\n    <td [hide]=\"!dataTable.expandColumnVisible\" (click)=\"expanded = !expanded; $event.stopPropagation()\" class=\"row-expand-button\">\n        <span class=\"fa fa-arrow-circle-o-right\" [hide]=\"expanded\"></span>\n        <span class=\"fa fa-arrow-circle-o-down\" [hide]=\"!expanded\"></span>\n    </td>\n    <td [hide]=\"!dataTable.indexColumnVisible\" class=\"index-column\" [textContent]=\"displayIndex\"></td>\n    <td [hide]=\"!dataTable.selectColumnVisible\" class=\"select-column\">\n        <input type=\"checkbox\" [(ngModel)]=\"selected\"/>\n    </td>\n    <td *ngFor=\"let column of dataTable.columns\" [hide]=\"!column.visible\" [ngClass]=\"column.styleClassObject\" class=\"data-column\"\n        [style.background-color]=\"column.getCellColor(_this, index)\">\n        <div *ngIf=\"!column.cellTemplate\" [textContent]=\"item[column.property]\"></div>\n        <div *ngIf=\"column.cellTemplate\" [ngTemplateOutlet]=\"column.cellTemplate\" [ngOutletContext]=\"{column: column, row: _this, item: item}\"></div>\n    </td>\n</tr>\n<tr *ngIf=\"dataTable.expandableRows\" [hide]=\"!expanded\" class=\"row-expansion\">\n    <td [attr.colspan]=\"dataTable.columnCount\">\n        <div [ngTemplateOutlet]=\"dataTable.expandTemplate\" [ngOutletContext]=\"{row: _this, item: item}\"></div>\n    </td>\n</tr>\n";

var ROW_STYLE = "\n.select-column {\n    text-align: center;\n}\n\n.row-expand-button {\n    cursor: pointer;\n    text-align: center;\n}\n\n.clickable {\n    cursor: pointer;\n}\n";

var DataTableRow = /** @class */ (function () {
    function DataTableRow(dataTable) {
        this.dataTable = dataTable;
        this.selectedChange = new core.EventEmitter();
        this._this = this; // FIXME is there no template keyword for this in angular 2?
    }
    Object.defineProperty(DataTableRow.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.selectedChange.emit(selected);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableRow.prototype, "displayIndex", {
        // other:
        get: function () {
            if (this.dataTable.pagination) {
                return this.dataTable.displayParams.offset + this.index + 1;
            }
            else {
                return this.index + 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    DataTableRow.prototype.getTooltip = function () {
        if (this.dataTable.rowTooltip) {
            return this.dataTable.rowTooltip(this.item, this, this.index);
        }
        return '';
    };
    DataTableRow.prototype.ngOnDestroy = function () {
        this.selected = false;
    };
    DataTableRow.decorators = [
        { type: core.Component, args: [{
                    selector: '[dataTableRow]',
                    template: ROW_TEMPLATE,
                    styles: [ROW_STYLE]
                },] },
    ];
    /** @nocollapse */
    DataTableRow.ctorParameters = function () { return [
        { type: DataTable, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return DataTable; }),] },] },
    ]; };
    DataTableRow.propDecorators = {
        'item': [{ type: core.Input },],
        'index': [{ type: core.Input },],
        'selectedChange': [{ type: core.Output },],
    };
    return DataTableRow;
}());

var defaultTranslations = {
    indexColumn: 'index',
    selectColumn: 'select',
    expandColumn: 'expand',
    paginationLimit: 'Limit',
    paginationRange: 'Results'
};

function drag(event, _a) {
    var move = _a.move, up = _a.up;
    var startX = event.pageX;
    var startY = event.pageY;
    var x = startX;
    var y = startY;
    var moved = false;
    function mouseMoveHandler(event) {
        var dx = event.pageX - x;
        var dy = event.pageY - y;
        x = event.pageX;
        y = event.pageY;
        if (dx || dy)
            moved = true;
        move(event, dx, dy, x, y);
        event.preventDefault(); // to avoid text selection
    }
    function mouseUpHandler(event) {
        x = event.pageX;
        y = event.pageY;
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        if (up)
            up(event, x, y, moved);
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}

var TABLE_TEMPLATE = "\n<div class=\"data-table-wrapper\">\n    <data-table-header *ngIf=\"header\"></data-table-header>\n\n    <div class=\"data-table-box\">\n        <table class=\"table table-condensed data-table\">\n            <thead>\n                <tr>\n                    <th [hide]=\"!expandColumnVisible\" class=\"expand-column-header\">\n                    <th [hide]=\"!indexColumnVisible\" class=\"index-column-header\">\n                        <span [textContent]=\"indexColumnHeader\"></span>\n                    </th>\n                    <th [hide]=\"!selectColumnVisible\" class=\"select-column-header\">\n                        <input [hide]=\"!multiSelect\" type=\"checkbox\" [(ngModel)]=\"selectAllCheckbox\"/>\n                    </th>\n                    <th *ngFor=\"let column of columns\" #th [hide]=\"!column.visible\" (click)=\"headerClicked(column, $event)\"\n                        [class.sortable]=\"column.sortable\" [class.resizable]=\"column.resizable\"\n                        [ngClass]=\"column.styleClassObject\" class=\"column-header\" [style.width]=\"column.width | px\">\n                        <span *ngIf=\"!column.headerTemplate\" [textContent]=\"column.header\"></span>\n                        <span *ngIf=\"column.headerTemplate\" [ngTemplateOutlet]=\"column.headerTemplate\" [ngOutletContext]=\"{column: column}\"></span>\n                        <span class=\"column-sort-icon\" *ngIf=\"column.sortable\">\n                           <i class=\"fa fa-sort column-sortable-icon\" [hide]=\"column.property === sortBy\"></i>\n                            <span [hide]=\"column.property !== sortBy\">\n                                <i class=\"fa fa-sort-asc\"  [hide]=\"sortAsc\"></i>\n\t\t\t\t\t\t\t\t<i class=\"fa fa-sort-desc\"  [hide]=\"!sortAsc\"></i>\n                            </span>\n                        </span>\n                        <span *ngIf=\"column.resizable\" class=\"column-resize-handle\" (mousedown)=\"resizeColumnStart($event, column, th)\"></span>\n                    </th>\n                </tr>\n            </thead>\n            <tbody *ngFor=\"let item of items; let index=index\" class=\"data-table-row-wrapper\"\n                   dataTableRow #row [item]=\"item\" [index]=\"index\" (selectedChange)=\"onRowSelectChanged(row)\">\n            </tbody>\n            <tbody class=\"substitute-rows\" *ngIf=\"pagination && substituteRows\">\n                <tr *ngFor=\"let item of substituteItems, let index = index\"\n                    [class.row-odd]=\"(index + items.length) % 2 === 0\"\n                    [class.row-even]=\"(index + items.length) % 2 === 1\"\n                    >\n                    <td [hide]=\"!expandColumnVisible\"></td>\n                    <td [hide]=\"!indexColumnVisible\">&nbsp;</td>\n                    <td [hide]=\"!selectColumnVisible\"></td>\n                    <td *ngFor=\"let column of columns\" [hide]=\"!column.visible\">\n                </tr>\n            </tbody>\n        </table>\n        <div class=\"loading-cover\" *ngIf=\"showReloading && reloading\"></div>\n    </div>\n\n    <data-table-pagination *ngIf=\"pagination\"></data-table-pagination>\n</div>\n";

var TABLE_STYLE = "\n/* bootstrap override: */\n\n:host /deep/ .data-table.table > tbody+tbody {\n    border-top: none;\n}\n:host /deep/ .data-table.table td {\n    vertical-align: middle;\n}\n\n:host /deep/ .data-table > thead > tr > th,\n:host /deep/ .data-table > tbody > tr > td {\n\toverflow: hidden;\n}\n\n/* I can't use the bootstrap striped table, because of the expandable rows */\n:host /deep/ .row-odd {\n    background-color: #F6F6F6;\n}\n:host /deep/ .row-even {\n}\n\n.data-table .substitute-rows > tr:hover,\n:host /deep/ .data-table .data-table-row:hover {\n    background-color: #ECECEC;\n}\n/* table itself: */\n\n.data-table {\n    box-shadow: 0 0 15px rgb(236, 236, 236);\n    table-layout: fixed;\n}\n\n/* header cells: */\n\n.column-header {\n    position: relative;\n}\n.expand-column-header {\n\twidth: 50px;\n}\n.select-column-header {\n\twidth: 50px;\n\ttext-align: center;\n}\n.index-column-header {\n\twidth: 40px;\n}\n.column-header.sortable {\n    cursor: pointer;\n}\n.column-header .column-sort-icon {\n\tfloat: right;\n}\n.column-header.resizable .column-sort-icon {\n    margin-right: 8px;\n}\n.column-header .column-sort-icon .column-sortable-icon {\n    color: lightgray;\n}\n.column-header .column-resize-handle {\n    position: absolute;\n    top: 0;\n    right: 0;\n    margin: 0;\n    padding: 0;\n    width: 8px;\n    height: 100%;\n    cursor: col-resize;\n}\n\n/* cover: */\n\n.data-table-box {\n    position: relative;\n}\n\n.loading-cover {\n   position: absolute;\n   width: 100%;\n   height: 100%;\n   background-color: rgba(255, 255, 255, 0.3);\n   top: 0;\n}\n";

var DataTable = /** @class */ (function () {
    function DataTable() {
        this._items = [];
        this.header = true;
        this.pagination = true;
        this.indexColumn = true;
        this.indexColumnHeader = '';
        this.selectColumn = false;
        this.multiSelect = true;
        this.substituteRows = true;
        this.expandableRows = false;
        this.translations = defaultTranslations;
        this.selectOnRowClick = false;
        this.autoReload = true;
        this.showReloading = false;
        this._sortAsc = true;
        this._offset = 0;
        this._limit = 10;
        // Reloading:
        this._reloading = false;
        this.reload = new core.EventEmitter();
        this._displayParams = {}; // params of the last finished reload
        this._scheduledReload = null;
        // event handlers:
        this.rowClick = new core.EventEmitter();
        this.rowDoubleClick = new core.EventEmitter();
        this.headerClick = new core.EventEmitter();
        this.cellClick = new core.EventEmitter();
        this.selectedRows = [];
        this._selectAllCheckbox = false;
        // column resizing:
        this._resizeInProgress = false;
        this.resizeLimit = 30;
    }
    Object.defineProperty(DataTable.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            this._items = items;
            this._onReloadFinished();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "sortBy", {
        get: function () {
            return this._sortBy;
        },
        set: function (value) {
            this._sortBy = value;
            this._triggerReload();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "sortAsc", {
        get: function () {
            return this._sortAsc;
        },
        set: function (value) {
            this._sortAsc = value;
            this._triggerReload();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (value) {
            this._offset = value;
            this._triggerReload();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "limit", {
        get: function () {
            return this._limit;
        },
        set: function (value) {
            this._limit = value;
            this._triggerReload();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "page", {
        // calculated property:
        get: function () {
            return Math.floor(this.offset / this.limit) + 1;
        },
        set: function (value) {
            this.offset = (value - 1) * this.limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTable.prototype, "lastPage", {
        get: function () {
            return Math.ceil(this.itemCount / this.limit);
        },
        enumerable: true,
        configurable: true
    });
    // setting multiple observable properties simultaneously
    DataTable.prototype.sort = function (sortBy, asc) {
        this.sortBy = sortBy;
        this.sortAsc = asc;
    };
    // init
    DataTable.prototype.ngOnInit = function () {
        this._initDefaultValues();
        this._initDefaultClickEvents();
        this._updateDisplayParams();
        if (this.autoReload && this._scheduledReload == null) {
            this.reloadItems();
        }
    };
    DataTable.prototype._initDefaultValues = function () {
        this.indexColumnVisible = this.indexColumn;
        this.selectColumnVisible = this.selectColumn;
        this.expandColumnVisible = this.expandableRows;
    };
    DataTable.prototype._initDefaultClickEvents = function () {
        var _this = this;
        this.headerClick.subscribe(function (tableEvent) { return _this.sortColumn(tableEvent.column); });
        if (this.selectOnRowClick) {
            this.rowClick.subscribe(function (tableEvent) { return tableEvent.row.selected = !tableEvent.row.selected; });
        }
    };
    Object.defineProperty(DataTable.prototype, "reloading", {
        get: function () {
            return this._reloading;
        },
        enumerable: true,
        configurable: true
    });
    DataTable.prototype.reloadItems = function () {
        this._reloading = true;
        this.reload.emit(this._getRemoteParameters());
    };
    DataTable.prototype._onReloadFinished = function () {
        this._updateDisplayParams();
        this._selectAllCheckbox = false;
        this._reloading = false;
    };
    Object.defineProperty(DataTable.prototype, "displayParams", {
        get: function () {
            return this._displayParams;
        },
        enumerable: true,
        configurable: true
    });
    DataTable.prototype._updateDisplayParams = function () {
        this._displayParams = {
            sortBy: this.sortBy,
            sortAsc: this.sortAsc,
            offset: this.offset,
            limit: this.limit
        };
    };
    // for avoiding cascading reloads if multiple params are set at once:
    DataTable.prototype._triggerReload = function () {
        var _this = this;
        if (this._scheduledReload) {
            clearTimeout(this._scheduledReload);
        }
        this._scheduledReload = setTimeout(function () {
            _this.reloadItems();
        });
    };
    DataTable.prototype.rowClicked = function (row, event) {
        this.rowClick.emit({ row: row, event: event });
    };
    DataTable.prototype.rowDoubleClicked = function (row, event) {
        this.rowDoubleClick.emit({ row: row, event: event });
    };
    DataTable.prototype.headerClicked = function (column, event) {
        if (!this._resizeInProgress) {
            this.headerClick.emit({ column: column, event: event });
        }
        else {
            this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
        }
    };
    DataTable.prototype.cellClicked = function (column, row, event) {
        this.cellClick.emit({ row: row, column: column, event: event });
    };
    // functions:
    DataTable.prototype._getRemoteParameters = function () {
        var params = {};
        if (this.sortBy) {
            params.sortBy = this.sortBy;
            params.sortAsc = this.sortAsc;
        }
        if (this.pagination) {
            params.offset = this.offset;
            params.limit = this.limit;
        }
        return params;
    };
    DataTable.prototype.sortColumn = function (column) {
        if (column.sortable) {
            var ascending = this.sortBy === column.property ? !this.sortAsc : true;
            this.sort(column.property, ascending);
        }
    };
    Object.defineProperty(DataTable.prototype, "columnCount", {
        get: function () {
            var count = 0;
            count += this.indexColumnVisible ? 1 : 0;
            count += this.selectColumnVisible ? 1 : 0;
            count += this.expandColumnVisible ? 1 : 0;
            this.columns.toArray().forEach(function (column) {
                count += column.visible ? 1 : 0;
            });
            return count;
        },
        enumerable: true,
        configurable: true
    });
    DataTable.prototype.getRowColor = function (item, index, row) {
        if (this.rowColors !== undefined) {
            return this.rowColors(item, row, index);
        }
    };
    Object.defineProperty(DataTable.prototype, "selectAllCheckbox", {
        get: function () {
            return this._selectAllCheckbox;
        },
        set: function (value) {
            this._selectAllCheckbox = value;
            this._onSelectAllChanged(value);
        },
        enumerable: true,
        configurable: true
    });
    DataTable.prototype._onSelectAllChanged = function (value) {
        this.rows.toArray().forEach(function (row) { return row.selected = value; });
    };
    DataTable.prototype.onRowSelectChanged = function (row) {
        // maintain the selectedRow(s) view
        if (this.multiSelect) {
            var index = this.selectedRows.indexOf(row);
            if (row.selected && index < 0) {
                this.selectedRows.push(row);
            }
            else if (!row.selected && index >= 0) {
                this.selectedRows.splice(index, 1);
            }
        }
        else {
            if (row.selected) {
                this.selectedRow = row;
            }
            else if (this.selectedRow === row) {
                this.selectedRow = undefined;
            }
        }
        // unselect all other rows:
        if (row.selected && !this.multiSelect) {
            this.rows.toArray().filter(function (row_) { return row_.selected; }).forEach(function (row_) {
                if (row_ !== row) {
                    row_.selected = false;
                }
            });
        }
    };
    Object.defineProperty(DataTable.prototype, "substituteItems", {
        // other:
        get: function () {
            return Array.from({ length: this.displayParams.limit - this.items.length });
        },
        enumerable: true,
        configurable: true
    });
    DataTable.prototype.resizeColumnStart = function (event, column, columnElement) {
        var _this = this;
        this._resizeInProgress = true;
        drag(event, {
            move: function (moveEvent, dx) {
                if (_this._isResizeInLimit(columnElement, dx)) {
                    column.width = columnElement.offsetWidth + dx;
                }
            },
        });
    };
    DataTable.prototype._isResizeInLimit = function (columnElement, dx) {
        /* This is needed because CSS min-width didn't work on table-layout: fixed.
         Without the limits, resizing can make the next column disappear completely,
         and even increase the table width. The current implementation suffers from the fact,
         that offsetWidth sometimes contains out-of-date values. */
        if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) ||
            !columnElement.nextElementSibling || // resizing doesn't make sense for the last visible column
            (dx >= 0 && (columnElement.nextElementSibling.offsetWidth + dx) <= this.resizeLimit)) {
            return false;
        }
        return true;
    };
    DataTable.decorators = [
        { type: core.Component, args: [{
                    selector: 'data-table',
                    template: TABLE_TEMPLATE,
                    styles: [TABLE_STYLE]
                },] },
    ];
    /** @nocollapse */
    DataTable.ctorParameters = function () { return []; };
    DataTable.propDecorators = {
        'items': [{ type: core.Input },],
        'itemCount': [{ type: core.Input },],
        'columns': [{ type: core.ContentChildren, args: [DataTableColumn,] },],
        'rows': [{ type: core.ViewChildren, args: [DataTableRow,] },],
        'expandTemplate': [{ type: core.ContentChild, args: ['dataTableExpand',] },],
        'headerTitle': [{ type: core.Input },],
        'header': [{ type: core.Input },],
        'pagination': [{ type: core.Input },],
        'indexColumn': [{ type: core.Input },],
        'indexColumnHeader': [{ type: core.Input },],
        'rowColors': [{ type: core.Input },],
        'rowTooltip': [{ type: core.Input },],
        'selectColumn': [{ type: core.Input },],
        'multiSelect': [{ type: core.Input },],
        'substituteRows': [{ type: core.Input },],
        'expandableRows': [{ type: core.Input },],
        'translations': [{ type: core.Input },],
        'selectOnRowClick': [{ type: core.Input },],
        'autoReload': [{ type: core.Input },],
        'showReloading': [{ type: core.Input },],
        'sortBy': [{ type: core.Input },],
        'sortAsc': [{ type: core.Input },],
        'offset': [{ type: core.Input },],
        'limit': [{ type: core.Input },],
        'page': [{ type: core.Input },],
        'reload': [{ type: core.Output },],
        'rowClick': [{ type: core.Output },],
        'rowDoubleClick': [{ type: core.Output },],
        'headerClick': [{ type: core.Output },],
        'cellClick': [{ type: core.Output },],
    };
    return DataTable;
}());

var PAGINATION_TEMPLATE = "\n<div class=\"pagination-box\">\n    <div class=\"pagination-range\">\n        {{dataTable.translations.paginationRange}}:\n        <span [textContent]=\"dataTable.offset + 1\"></span>\n        -\n        <span [textContent]=\"[dataTable.offset + dataTable.limit , dataTable.itemCount] | min\"></span>\n        /\n        <span [textContent]=\"dataTable.itemCount\"></span>\n    </div>\n    <div class=\"pagination-controllers\">\n        <div class=\"pagination-limit\">\n            <div class=\"input-group\">\n                <span class=\"input-group-addon\">{{dataTable.translations.paginationLimit}}:</span>\n                <input #limitInput type=\"number\" class=\"form-control\" min=\"1\" step=\"1\"\n                       [ngModel]=\"limit\" (blur)=\"limit = limitInput.value\"\n                       (keyup.enter)=\"limit = limitInput.value\" (keyup.esc)=\"limitInput.value = limit\"/>\n            </div>\n        </div>\n        <div class=\" pagination-pages\">\n            <button [disabled]=\"dataTable.offset <= 0\" (click)=\"pageFirst()\" class=\"btn btn-default pagination-firstpage\">&laquo;</button>\n            <button [disabled]=\"dataTable.offset <= 0\" (click)=\"pageBack()\" class=\"btn btn-default pagination-prevpage\">&lsaquo;</button>\n            <div class=\"pagination-page\">\n                <div class=\"input-group\">\n                    <input #pageInput type=\"number\" class=\"form-control\" min=\"1\" step=\"1\" max=\"{{maxPage}}\"\n                           [ngModel]=\"page\" (blur)=\"page = pageInput.value\"\n                           (keyup.enter)=\"page = pageInput.value\" (keyup.esc)=\"pageInput.value = page\"/>\n                    <div class=\"input-group-addon\">\n                        <span>/</span>\n                        <span [textContent]=\"dataTable.lastPage\"></span>\n                    </div>\n                </div>\n            </div>\n            <button [disabled]=\"(dataTable.offset + dataTable.limit) >= dataTable.itemCount\" (click)=\"pageForward()\" class=\"btn btn-default pagination-nextpage\">&rsaquo;</button>\n            <button [disabled]=\"(dataTable.offset + dataTable.limit) >= dataTable.itemCount\" (click)=\"pageLast()\" class=\"btn btn-default pagination-lastpage\">&raquo;</button>\n        </div>\n    </div>\n</div>\n";

var PAGINATION_STYLE = "\n.pagination-box {\n    position: relative;\n    margin-top: -10px;\n}\n.pagination-range {\n    margin-top: 7px;\n    margin-left: 3px;\n    display: inline-block;\n}\n.pagination-controllers {\n    float: right;\n}\n.pagination-controllers input {\n    min-width: 60px;\n    /*padding: 1px 0px 0px 5px;*/\n    text-align: right;\n}\n\n.pagination-limit {\n    margin-right: 25px;\n    display: inline-table;\n    width: 150px;\n}\n.pagination-pages {\n    display: inline-block;\n}\n.pagination-page {\n    width: 110px;\n    display: inline-table;\n}\n.pagination-page .input-group-addon {\n    display: table-cell;\n}\n.pagination-box button {\n    outline: none !important;\n}\n.pagination-prevpage,\n.pagination-nextpage,\n.pagination-firstpage,\n.pagination-lastpage {\n    vertical-align: top;\n}\n.pagination-reload {\n    color: gray;\n    font-size: 12px;\n}\n";

var DataTablePagination = /** @class */ (function () {
    function DataTablePagination(dataTable) {
        this.dataTable = dataTable;
    }
    DataTablePagination.prototype.pageBack = function () {
        this.dataTable.offset -= Math.min(this.dataTable.limit, this.dataTable.offset);
    };
    DataTablePagination.prototype.pageForward = function () {
        this.dataTable.offset += this.dataTable.limit;
    };
    DataTablePagination.prototype.pageFirst = function () {
        this.dataTable.offset = 0;
    };
    DataTablePagination.prototype.pageLast = function () {
        this.dataTable.offset = (this.maxPage - 1) * this.dataTable.limit;
    };
    Object.defineProperty(DataTablePagination.prototype, "maxPage", {
        get: function () {
            return Math.ceil(this.dataTable.itemCount / this.dataTable.limit);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTablePagination.prototype, "limit", {
        get: function () {
            return this.dataTable.limit;
        },
        set: function (value) {
            this.dataTable.limit = Number(value); // TODO better way to handle that value of number <input> is string?
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTablePagination.prototype, "page", {
        get: function () {
            return this.dataTable.page;
        },
        set: function (value) {
            this.dataTable.page = Number(value);
        },
        enumerable: true,
        configurable: true
    });
    DataTablePagination.decorators = [
        { type: core.Component, args: [{
                    selector: 'data-table-pagination',
                    template: PAGINATION_TEMPLATE,
                    styles: [PAGINATION_STYLE]
                },] },
    ];
    /** @nocollapse */
    DataTablePagination.ctorParameters = function () { return [
        { type: DataTable, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return DataTable; }),] },] },
    ]; };
    return DataTablePagination;
}());

var HEADER_TEMPLATE = "\n<div class=\"data-table-header\">\n    <h4 class=\"title\" [textContent]=\"dataTable.headerTitle\"></h4>\n    <div class=\"button-panel\">\n        <button type=\"button\" class=\"btn btn-default btn-sm refresh-button\"\n            (click)=\"dataTable.reloadItems()\">\n             <i class=\"fa fa-refresh\"></i>\n        </button>\n        <button type=\"button\" class=\"btn btn-default btn-sm column-selector-button\" [class.active]=\"columnSelectorOpen\"\n            (click)=\"columnSelectorOpen = !columnSelectorOpen; $event.stopPropagation()\" >\n            <i class=\"fa fa-list\"></i>\n        </button>\n        <div class=\"column-selector-wrapper\" (click)=\"$event.stopPropagation()\">\n            <div *ngIf=\"columnSelectorOpen\" class=\"column-selector-box card\">\n                <div *ngIf=\"dataTable.expandableRows\" class=\"column-selector-fixed-column checkbox\">\n                    <label>\n                        <input type=\"checkbox\" [(ngModel)]=\"dataTable.expandColumnVisible\"/>\n                        <span>{{dataTable.translations.expandColumn}}</span>\n                    </label>\n                </div>\n                <div *ngIf=\"dataTable.indexColumn\" class=\"column-selector-fixed-column checkbox\">\n                    <label>\n                        <input type=\"checkbox\" [(ngModel)]=\"dataTable.indexColumnVisible\"/>\n                        <span>{{dataTable.translations.indexColumn}}</span>\n                    </label>\n                </div>\n                <div *ngIf=\"dataTable.selectColumn\" class=\"column-selector-fixed-column checkbox\">\n                    <label>\n                        <input type=\"checkbox\" [(ngModel)]=\"dataTable.selectColumnVisible\"/>\n                        <span>{{dataTable.translations.selectColumn}}</span>\n                    </label>\n                </div>\n                <div *ngFor=\"let column of dataTable.columns\" class=\"column-selector-column checkbox\">\n                    <label>\n                        <input type=\"checkbox\" [(ngModel)]=\"column.visible\"/>\n                        <span [textContent]=\"column.header\"></span>\n                    </label>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";

var HEADER_STYLE = "\n.data-table-header {\n    min-height: 25px;\n    margin-bottom: 10px;\n}\n.title {\n    display: inline-block;\n    margin: 5px 0 0 5px;\n}\n.button-panel {\n    float: right;\n}\n.button-panel button {\n    outline: none !important;\n}\n\n.column-selector-wrapper {\n    position: relative;\n}\n.column-selector-box {\n    box-shadow: 0 0 10px lightgray;\n    width: 150px;\n    padding: 10px;\n    position: absolute;\n    right: 0;\n    top: 1px;\n    z-index: 1060;\n}\n.column-selector-box .checkbox {\n    margin-bottom: 4px;\n}\n.column-selector-fixed-column {\n    font-style: italic;\n}\n";

var DataTableHeader = /** @class */ (function () {
    function DataTableHeader(dataTable) {
        this.dataTable = dataTable;
        this.columnSelectorOpen = false;
    }
    DataTableHeader.prototype._closeSelector = function () {
        this.columnSelectorOpen = false;
    };
    DataTableHeader.decorators = [
        { type: core.Component, args: [{
                    selector: 'data-table-header',
                    template: HEADER_TEMPLATE,
                    styles: [HEADER_STYLE],
                    host: {
                        '(document:click)': '_closeSelector()'
                    }
                },] },
    ];
    /** @nocollapse */
    DataTableHeader.ctorParameters = function () { return [
        { type: DataTable, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return DataTable; }),] },] },
    ]; };
    return DataTableHeader;
}());

var PixelConverter = /** @class */ (function () {
    function PixelConverter() {
    }
    PixelConverter.prototype.transform = function (value, args) {
        if (value === undefined) {
            return;
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return value + 'px';
        }
    };
    PixelConverter.decorators = [
        { type: core.Pipe, args: [{
                    name: 'px'
                },] },
    ];
    /** @nocollapse */
    PixelConverter.ctorParameters = function () { return []; };
    return PixelConverter;
}());

function isBlank(obj) {
    return obj === undefined || obj === null;
}
var Hide = /** @class */ (function () {
    function Hide(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._prevCondition = null;
    }
    Object.defineProperty(Hide.prototype, "hide", {
        set: function (newCondition) {
            this.initDisplayStyle();
            if (newCondition && (isBlank(this._prevCondition) || !this._prevCondition)) {
                this._prevCondition = true;
                this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', 'none');
            }
            else if (!newCondition && (isBlank(this._prevCondition) || this._prevCondition)) {
                this._prevCondition = false;
                this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', this._displayStyle);
            }
        },
        enumerable: true,
        configurable: true
    });
    Hide.prototype.initDisplayStyle = function () {
        if (this._displayStyle === undefined) {
            var displayStyle = this._elementRef.nativeElement.style.display;
            if (displayStyle && displayStyle !== 'none') {
                this._displayStyle = displayStyle;
            }
        }
    };
    Hide.decorators = [
        { type: core.Directive, args: [{ selector: '[hide]', inputs: ['hide'] },] },
    ];
    /** @nocollapse */
    Hide.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.Renderer, },
    ]; };
    return Hide;
}());

var MinPipe = /** @class */ (function () {
    function MinPipe() {
    }
    MinPipe.prototype.transform = function (value, args) {
        return Math.min.apply(null, value);
    };
    MinPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'min'
                },] },
    ];
    /** @nocollapse */
    MinPipe.ctorParameters = function () { return []; };
    return MinPipe;
}());

var DataTableResource = /** @class */ (function () {
    function DataTableResource(items) {
        this.items = items;
    }
    DataTableResource.prototype.query = function (params, filter) {
        var result = [];
        if (filter) {
            result = this.items.filter(filter);
        }
        else {
            result = this.items.slice(); // shallow copy to use for sorting instead of changing the original
        }
        if (params.sortBy) {
            result.sort(function (a, b) {
                if (typeof a[params.sortBy] === 'string') {
                    return a[params.sortBy].localeCompare(b[params.sortBy]);
                }
                else {
                    return a[params.sortBy] - b[params.sortBy];
                }
            });
            if (params.sortAsc === false) {
                result.reverse();
            }
        }
        if (params.offset !== undefined) {
            if (params.limit === undefined) {
                result = result.slice(params.offset, result.length);
            }
            else {
                result = result.slice(params.offset, params.offset + params.limit);
            }
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(result); });
        });
    };
    DataTableResource.prototype.count = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve(_this.items.length); });
        });
    };
    return DataTableResource;
}());

var DATA_TABLE_DIRECTIVES = [DataTable, DataTableColumn];
var DataTableModule = /** @class */ (function () {
    function DataTableModule() {
    }
    DataTableModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, forms.FormsModule],
                    declarations: [
                        DataTable, DataTableColumn,
                        DataTableRow, DataTablePagination, DataTableHeader,
                        PixelConverter, Hide, MinPipe
                    ],
                    exports: [DataTable, DataTableColumn]
                },] },
    ];
    /** @nocollapse */
    DataTableModule.ctorParameters = function () { return []; };
    return DataTableModule;
}());

exports.DataTable = DataTable;
exports.DataTableColumn = DataTableColumn;
exports.DataTableRow = DataTableRow;
exports.DataTablePagination = DataTablePagination;
exports.DataTableHeader = DataTableHeader;
exports.DATA_TABLE_DIRECTIVES = DATA_TABLE_DIRECTIVES;
exports.DataTableModule = DataTableModule;
exports.defaultTranslations = defaultTranslations;
exports.DataTableResource = DataTableResource;

Object.defineProperty(exports, '__esModule', { value: true });

})));
