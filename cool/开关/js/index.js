
    /* jQuery helper funciton to apply 
    /* checkboxes.

    /* there's probably something 
    /* that will not work in some 
    /* occasion so it's simple and 
    /* flexible.

    /* aim to make it completely 
    /* accessible in future */



		$.fn.chkbox = function() {
		  
			return $(this).each( function(k,v) {
			
				var $this = $(v);
				if( $this.is(':checkbox') && !$this.data('checkbox-replaced') ) {
				 	
					// add some data to this checkbox so we can avoid re-replacing it.
					$this.data('checkbox-replaced', true);
          
					// create HTML for the new checkbox.
					var $l = $('<label for="'+$this.attr('id')+'" class="chkbox"></label>');
					var $y = $('<span class="yes">checked</span>');
					var $n = $('<span class="no">unchecked</span>');
					var $t = $('<span class="toggle"></span>');
					
					// insert the HTML in before the checkbox.
					$l.append( $y, $n, $t ).insertBefore( $this );
					$this.addClass('replaced');
					
					// check if the checkbox is checked, apply styling. trigger focus.
					$this.on('change', function() {
					
						if ($this.is(':checked')) {  $l.addClass('on'); }
						else { $l.removeClass('on'); }
						
						$this.trigger('focus');
					
					});
					
					$this.on('focus', function() { $l.addClass('focus') });
					$this.on('blur', function() { $l.removeClass('focus') });
					
					
					
					
					// check if the checkbox is checked on init.
					if ($this.is(':checked')) {  $l.addClass('on'); }
					else { $l.removeClass('on'); }
				  
				}
			
			});
	
		}; 
		$(':checkbox').chkbox();










$.fn.rdo = function() {
		  
			return $(this).each( function(k,v) {
			  
				var $this = $(v);
				if( $this.is(':radio') && !$this.data('radio-replaced') ) {
				 	
					// add some data to this checkbox so we can avoid re-replacing it.
					$this.data('radio-replaced', true);
					
          
					// create HTML for the new checkbox.
					var $l = $('<label for="'+$this.attr('id')+'" class="radio"></label>');
					var $p = $('<span class="pip"></span>');
					
					// insert the HTML in before the checkbox.
					$l.append( $p ).insertBefore( $this );
					$this.addClass('replaced');
					
					// check if the radio is checked, apply styling. trigger focus.
					$this.on('change', function() {
            
            $('label.radio').each( function(k,v) {
              
              var $v = $(v);
              if( $('#'+ $v.attr('for') ).is(':checked') ) {
               $v.addClass('on'); 
              } else {
                $v.removeClass('on'); 
              }
              
            });
            
						$this.trigger('focus');
					
					});
					
					$this.on('focus', function() { $l.addClass('focus') });
					$this.on('blur', function() { $l.removeClass('focus') });
					
					
					
					
					// check if the radio is checked on init.
					$('label.radio').each( function(k,v) {
              
              var $v = $(v);
              if( $('#'+ $v.attr('for') ).is(':checked') ) {
               $v.addClass('on'); 
              } else {
                $v.removeClass('on'); 
              }
              
            });
				  
				}
			
			});
	
		}; 


    $(':radio').rdo();
