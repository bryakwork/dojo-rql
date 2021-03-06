/**
 * Created by victorsecuring on 23.11.16.
 */
/**
 * Created by victorsecuring on 15.11.16.
 */
define([
        'dojo/_base/declare',
        'dstore/Memory',
        "dstore/Rest",
        'dstore/Trackable',
        "Rscript/Composite/widget/Composite",
        'Rscript/FilteredGrid/widget/FilteredGrid',
        'Rscript/FilterControlPanel/widget/FilterControlPanel',
        'Rscript/DataPreviewControlPanel/widget/DataPreviewControlPanel',
        'Rscript/TableWithConfiguration/widget/TableWithConfiguration'
    ], function (declare,
                 Memory,
                 Rest,
                 Trackable,
                 Composite,
                 FilteredGrid,
                 FilterControlPanel,
                 DataPreviewControlPanel) {
        return function (config) {

            //config for grid;
            var filteredGridOption = {
                "title": "Title",
                "name": "dataView",
                "options": {
                    "columns": config.columns,
                    "collection": config.dstore,
                    "selectionMode": "single",
                    "allowTextSelection": true,
                    "pagingLinks": false,
                    "pagingTextBox": true,
                    "firstLastArrows": true,
                    "rowsPerPage": 20,
                    "pageSizeOptions": [20, 50, 100, 200],
                    "className": 'dgrid-autoheight'
                },
                "declare": [
                    "Grid",
                    "Keyboard",
                    "Selection",
                    "ColumnHider",
                    "ColumnResizer",
                    "ColumnReorder",
                    "GridRqlFilter"
                ]
            };

            //create filter
            var filterGrid = new FilteredGrid(filteredGridOption);
            var filterData = [];
            ///create filte config
            for (var columnIndex in config.columns) {
                if (config.columns.hasOwnProperty(columnIndex)) {
                    var column = config.columns[columnIndex];
                    filterData.push({
                        "label": column.field,
                        "value": {
                            "type": "string",
                            "name": column.field,
                            "field": {
                                'type': "TextBox"
                            }
                        },
                        "filter": [
                            {"id": 0, "label": "=", "value": "eq"},
                            {"id": 0, "label": "!=", "value": "ne"}
                        ]
                    });
                }
            }

            //config for filterPanel
            var tableFilterControlPanel = new FilterControlPanel({
                "title": "Панель управления фильтрами ",
                "id": "tableFilter",
                "name": "dataStoreViewerFilterPanel",
                "filteredStoreDataOption": filterData,
                "store": (config.filterStore !== null && config.filterStore !== undefined) ? config.filterStore
                    : new (declare([Rest, Trackable]))({
                        'headers': {
                            'Accept': 'application/json'
                        },
                        "target": config.filterUrl
                    })
            });


            //create grid with filter panel
            var grid = new DataPreviewControlPanel({
                title: "DataStoreViewer",
                filterControlPanel: tableFilterControlPanel,
                dataViewer: filterGrid
            });

            return grid;
        };
    }
);