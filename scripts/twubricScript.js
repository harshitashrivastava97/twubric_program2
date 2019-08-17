/** date - 8-17-2019
 * @author Harshita Shrivastava
 */

angular.module('TwubricModule', [])
    .controller('TwubricController', ['$scope', 'jsonLoader', function($scope, jsonLoader) {
        jsonLoader.loadData('values.json')
            .success(function(data) {
                $scope.values = data;
            });
    }])
    .directive('twubricDirective', function() {
        return {
            restrict: 'E',
            scope: {
                twitterAccountsInfo: '=info'
            },
            templateUrl: 'card.html',
            link: function(scope, element, attrs) {
                var options = {
                    layoutMode: 'fitRows',
                    itemSelector: '.card-item',
                    resizesContainer: true,
                    getSortData: {
                        total: '.total parseInt',
                        friends: '.friends parseInt',
                        influence: '.influence parseInt',
                        chirpiness: '.chirpiness parseInt'
                    }
                };

                var $container = $('.isotope').isotope(options);

                scope.$watch('twitterAccountsInfo', function(newVal, oldVal) {
                    $container.isotope('reloadItems').isotope({ sortBy: 'original-order' }); 
                    /**init datepicker */ 
                    $('#startDateField').datepicker("setDate", "Jan 1, 2011");
                    $('#endDateField').datepicker("setDate", "Dec 31, 2015");
                    $('#endDateField').datepicker({ 
                        dateFormat: 'M d, yy', 
                        changeMonth: true, 
                        changeYear: true, 
                        onSelect: function() {
                            $container.isotope({ filter: filterByDate });
                        } 
                    });
                    $('#startDateField').datepicker({ 
                        dateFormat: 'M d, yy', 
                        changeMonth: true, 
                        changeYear: true, 
                        onSelect: function(dateText, inst) {
                            $container.isotope({ filter: filterByDate });
                            // var date = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText);
                            // $("#endDateField").datepicker("option", "minDate", date);
                        } 
                    });
                });

                $('#sorts').on('click', 'button', function() {
                    var sortByValue = $(this).attr('data-sort-by');
                    $(this).toggleClass('selected');
                    if ($(this).hasClass('selected')) {
                        sortValue = true;    
                    } else {
                        sortValue = false;
                    }
                    $container.isotope('reloadItems').isotope({ sortBy: sortByValue, sortAscending: sortValue });
                });

                element.on('click', '#removeCard', function() {
                    $container.isotope('remove', $(this).parents('.card-item'));
                    $container.isotope('layout');
                });

                var filterByDate = function() {        
                    var startDate = $('#startDateField').val();
                    var endDate = $('#endDateField').val();
                    var date = $(this).find('.joinDate').text();

                    if (startDate !== undefined && endDate !== undefined && date !== undefined) {
                        date = new Date(date);
                        startDate = new Date(startDate);
                        endDate = new Date(endDate);
                    }
                    
                    return date >= startDate && date <= endDate;
                };

                Mousetrap.bind('t', function() {
                    $('#totalSortButton').click();
                });
                Mousetrap.bind('f', function() {
                    $('#friendsSortButton').click();
                });
                Mousetrap.bind('i', function() {
                    $('#influenceSortButton').click();
                });
                Mousetrap.bind('c', function() {
                    $('#chirpinessSortButton').click();
                });
            }
        }
    })
    .factory('jsonLoader', function($http) {
        var jsonLoader = {};
        jsonLoader.loadData = function(url) {
            return $http.get(url);
        };
        return jsonLoader;
    });
