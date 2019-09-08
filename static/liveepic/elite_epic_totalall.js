
    var useCategory = "yes";
    
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }



    var stages = 1; // day of competition
    if (sessionStorage.getItem('stages')) {
        stages = sessionStorage.getItem('stages');
    }

    document.addEventListener("DOMContentLoaded", function() {
        category(useCategory);
        intermediateOrFinish(stages);
    });
 
    function intermediateOrFinish(section){
        
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("displayAllButton").classList.add("active");        
            document.getElementById("displayAllButton").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").classList.add("active");        
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("displayAllButton").classList.remove("active");        
            document.getElementById("displayAllButton").disabled = true;
        }
 

        stages = section;

        if (stages == 1) {
            document.getElementById("Prologue").classList.remove("active");
            document.getElementById("Prologue").disabled = true;
            document.getElementById("Stage1").classList.add("active");
            document.getElementById("Stage1").disabled = false;
            document.getElementById("Stage2").classList.add("active");
            document.getElementById("Stage2").disabled = false;
            document.getElementById("Stage3").classList.add("active");
            document.getElementById("Stage3").disabled = false;
            
            sessionStorage.setItem('stages', '1');
            
            
        } else if (stages == 2) {
            document.getElementById("Prologue").classList.add("active");
            document.getElementById("Prologue").disabled = false;
            document.getElementById("Stage1").classList.remove("active");
            document.getElementById("Stage1").disabled = true;
            document.getElementById("Stage2").classList.add("active");
            document.getElementById("Stage2").disabled = false;
            document.getElementById("Stage3").classList.add("active");
            document.getElementById("Stage3").disabled = false;
            
            sessionStorage.setItem('stages', '2');
            
        } else if (stages == 3) {
            document.getElementById("Prologue").classList.add("active");
            document.getElementById("Prologue").disabled = false;
            document.getElementById("Stage1").classList.add("active");
            document.getElementById("Stage1").disabled = false;
            document.getElementById("Stage2").classList.remove("active");
            document.getElementById("Stage2").disabled = true;
            document.getElementById("Stage3").classList.add("active");
            document.getElementById("Stage3").disabled = false;
            
            sessionStorage.setItem('stages', '3');
        } else if (stages == 4) {
            document.getElementById("Prologue").classList.add("active");
            document.getElementById("Prologue").disabled = false;
            document.getElementById("Stage1").classList.add("active");
            document.getElementById("Stage1").disabled = false;
            document.getElementById("Stage2").classList.add("active");
            document.getElementById("Stage2").disabled = false;
            document.getElementById("Stage3").classList.remove("active");
            document.getElementById("Stage3").disabled = true;
            
            sessionStorage.setItem('stages', '4');
        }  

        Load();

        
    }

    function category(choice){
        
        useCategory = choice;
        
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("displayAllButton").classList.add("active");        
            document.getElementById("displayAllButton").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").classList.add("active");        
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("displayAllButton").classList.remove("active");        
            document.getElementById("displayAllButton").disabled = true;
        }
 
        if (useCategory == "yes" && document.getElementById("finalTextAll") && document.getElementById("finalTextCategory")) {
            document.getElementById("finalTextAll").style.display = "none";        
            document.getElementById("finalTextCategory").style.display = "block";        
        } else if (useCategory == "no" && document.getElementById("finalTextAll") && document.getElementById("finalTextCategory")) {
            document.getElementById("finalTextAll").style.display = "block";        
            document.getElementById("finalTextCategory").style.display = "none";        
        }

    }


    function Load() {
            
        var url1 = "q1.txt";    
        var url2 = "q2.txt";    
        var url3 = "q3.txt";    
        var url4 = "q4.txt";    

        if (self.fetch) {

            if (stages == 1) {
                fetchResults(url1);
                document.getElementById("totalHeader").innerHTML = "Migdal Epic Israel<br>GC Prologue";
            } else if (stages == 2) {
                fetchResults(url2);
                document.getElementById("totalHeader").innerHTML = "Migdal Epic Israel<br>GC Stage 1";
            } else if (stages == 3) {
                fetchResults(url3);
                document.getElementById("totalHeader").innerHTML = "Migdal Epic Israel<br>GC Stage 2";
            } else if (stages == 4) {
                fetchResults(url4);
                document.getElementById("totalHeader").innerHTML = "Migdal Epic Israel<br>GC Stage 3";
            }

            
        } else {

            if (stages == 1) {
                fetchResultsXHR(url1);
            } else if (stages == 2) {
                fetchResultsXHR(url2);
            } else if (stages == 3) {
                fetchResultsXHR(url3);
            } else if (stages == 4) {
                fetchResultsXHR(url4);
            }
                        
        }


        document.getElementById("intermediateOrFinish").style.display = "block"; 
        document.getElementById("categoryOrAll").style.display = "block"; 

    }
    
    function fetchResults(urlX) {
                fetch(urlX)
                .then(response => {
                    if(response.ok) {
                    return response.text();
                    } else {
                    document.getElementById("result").innerHTML = "No Results Yet";
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText
                    })
                    }
                })
                .then(function(text) {
                    document.getElementById("intermediateOrFinish").style.display = "block"; 
                    document.getElementById("categoryOrAll").style.display = "block"; 
                    document.getElementById("result").innerHTML = text;
                    category(useCategory);
                })
                .catch(error => {
                    if (error.status === 404) {
                        console.log('no results on server');
                        document.getElementById("result").innerHTML = "No Results Yet";
                    } else {
                        console.log(error);
                    }
                })
       }

   function fetchResultsXHR(urlX) {
                var xhr;
                xhr = new XMLHttpRequest;
                xhr.onload = function() {
                    if (this.status == 200) {
                        document.getElementById("intermediateOrFinish").style.display = "block"; 
                        document.getElementById("categoryOrAll").style.display = "block"; 
                        document.getElementById("result").innerHTML = this.responseText;
                        category(useCategory);
                    } else if (this.status == 404) {
                        console.log('no results on server');
                        document.getElementById("result").innerHTML = "No Results Yet";
                    } else {
                        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
                    }

                };
                xhr.open("GET", urlX + ((/\?/).test(urlX) ? "&" : "?") + (new Date()).getTime());
                xhr.send();
       }
