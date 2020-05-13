$(function() {
	function serverErr(err, input, control) {
		console.log(err);
		$(control).removeClass('is-loading');
		$(input).removeAttr('readonly');
		validate(error);
		Swal.fire({
			type: 'error',
			title: 'Cannot connect to server',
			text: 'Something went wrong. Please try again later.'
		});
	}

	function validate(check) {
		$(btnCreate).removeAttr('disabled');
		for (let i = 0; i < check.length; i++) {
			if (check[i]) {
				$(btnCreate).attr('disabled', 'disabled');
				break;
			}
		}
	}

	function validateUsername(username) {
		let expr = /^[a-zA-Z0-9._]*$/;
		return expr.test(username);
	}

	function validateEmail(email) {
		let expr = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return expr.test(email);
	}

	function clearResponse(warning, textbox, icon, seq) {
		$(warning).text('');
		$(textbox).removeClass('is-success').removeClass('is-danger');
		$(icon).removeClass('has-text-success').removeClass('has-text-danger');
		error[seq % 3] = seq > 2;
		validate(error);
	}

	function checkInputs(input, textbox, icon, warning, warnMsg, valid, invalidMsg, seq) {
		if (input.trim() == '') {
			$(textbox).removeClass('is-success').addClass('is-danger');
			$(icon).removeClass('has-text-success').addClass('has-text-danger');
			$(warning).text(warnMsg);
			error[seq] = true;
			validate(error);
			return false;
		} else if (!valid) {
			$(textbox).removeClass('is-success').addClass('is-danger');
			$(icon).removeClass('has-text-success').addClass('has-text-danger');
			$(warning).text(invalidMsg);
			error[seq] = true;
			validate(error);
			return false;
		}
		return true;
	}

	function checkResponse(response, warning, input, control, icon, seq) {
		if (response.status == 'error') {
			$(warning).text(response.msg);
			$(input).removeClass('is-success').addClass('is-danger');
			$(icon).removeClass('has-text-success').addClass('has-text-danger');
			error[seq] = true;
		} else {
			$(input).removeClass('is-danger').addClass('is-success');
			$(icon).removeClass('has-text-danger').addClass('has-text-success');
			error[seq] = false;
		}
		$(control).removeClass('is-loading');
		$(input).removeAttr('readonly');
		validate(error);
	}

	function validatePassword(pass, confirm) {
		if (pass == confirm) {
			$(inpPassword).removeClass('is-danger').addClass('is-success');
			$(icnPassword).removeClass('has-text-danger').addClass('has-text-success');
			$(inpConfirm).removeClass('is-danger').addClass('is-success');
			$(icnConfirm).removeClass('has-text-danger').addClass('has-text-success');
			error[2] = false;
		} else {
			$(txtConfirmWarning).text('Passwords do not match');
			$(inpPassword).removeClass('is-success').addClass('is-danger');
			$(icnPassword).removeClass('has-text-success').addClass('has-text-danger');
			$(inpConfirm).removeClass('is-success').addClass('is-danger');
			$(icnConfirm).removeClass('has-text-success').addClass('has-text-danger');
			error[2] = true;
		}
		error[2] = pass !== confirm;
		validate(error);
	}

	function ajaxResponse() {
		$(btnCreate).removeClass('is-loading');
		$(btnView).removeAttr('disabled');
		$(inpUsername).removeAttr('readonly');
		$(inpEmail).removeAttr('readonly');
		$(inpPassword).removeAttr('readonly');
		$(inpConfirm).removeAttr('readonly');
		validate(error);
	}

	var error = [false, false, false], platform = window.matchMedia('only screen and (max-width: 760px)').matches ? 'm' : '';
	var btnCreate = '#' + platform + 'create';
	var inpUsername = '#' + platform + 'username', icnUsername = '#' + platform + 'user-icon', txtUserWarning = '#' + platform + 'user-warning', inpUserControl = '#' + platform + 'user-control';
	var inpEmail = '#' + platform + 'email', icnEmail = '#' + platform + 'email-icon', txtEmailWarning = '#' + platform + 'email-warning', inpEmailControl = '#' + platform + 'email-control';
	var btnView = '#' + platform + 'view', icnEye = '#' + platform + 'icon-pass', inpPassword = '#' + platform + 'password', icnPassword = '#' + platform + 'pass-icon', txtPassWarning = '#' + platform + 'pass-warning';
	var inpConfirm = '#' + platform + 'cpass', icnConfirm = '#' + platform + 'cpass-icon', txtConfirmWarning = '#' + platform + 'cpass-warning';

	$('html').removeClass('has-navbar-fixed-bottom').removeClass('has-navbar-fixed-top');
	$('.pageloader').removeClass('is-active');

	$('form').submit(function(e) {
		e.preventDefault();
		if ($(inpPassword).attr('type') == 'text') {
			$(inpPassword).attr('type', 'password');
			$(icnEye).removeClass('fa-eye-slash').addClass('fa-eye').addClass('has-text-white');
			$(btnView).removeClass('has-background-grey-dark').addClass('has-background-grey-lighter');
		}
		$(btnCreate).addClass('is-loading');
		$(btnView).attr('disabled', 'disabled');
		$(inpUsername).attr('readonly', true);
		$(inpEmail).attr('readonly', true);
		$(inpPassword).attr('readonly', true);
		$(inpConfirm).attr('readonly', true);
		let username = $(inpUsername).val(), email = $(inpEmail).val(), password = $(inpPassword).val();
		$.ajax({
			type: 'POST',
			url: 'register',
			data: {username:username, email:email, password:password},
			datatype: 'JSON',
			success: function(response) {
				ajaxResponse();
				Swal.fire({
					type: 'success',
					title: 'Registration Successful',
					text: response.msg,
					confirmButtonText: 'Sign In'
				}).then((result) => {
					if (result.value) {
						$('.title').text('Loading Login');
						$('.pageloader').addClass('is-active');
						window.location.href = '/linease-alpha/public/login';
						// Server 
						// window.location.href = '/linease-alpha/login';
					}
				});
			},
			error: function(err) {
				console.log(err);
				ajaxResponse();
				Swal.fire({
					type: 'error',
					title: 'Cannot connect to server',
					text: 'Something went wrong. Please try again later.'
				});
			}
		});
	});

	$('#' + platform + 'login').click(function(e) {
		if ($(btnCreate).hasClass('is-loading')) {
			e.preventDefault();
		} else {
			$('.title').text('Loading Login');
			$('.pageloader').addClass('is-active');
		}
	});

	$(inpUsername).focusout(function() {
		var username = $(this).val(), valid = validateUsername(username);
		let message1 = 'Username cannot be empty', message2 = 'Special characters except . and _ are not allowed';
		let proceed = checkInputs(username, this, icnUsername, txtUserWarning, message1, valid, message2, 0);
		if (proceed) {
			if (!$(inpUserControl).hasClass('is-loading')) {
				$(inpUserControl).addClass('is-loading');
				clearResponse(txtUserWarning, inpUsername, icnUsername, 3);
				$(inpUsername).attr('readonly', true);
				$.ajax({
					type: 'POST',
					url: 'users',
					data: {username:username, data:'username'},
					datatype: 'JSON',
					success: function(response) {
						checkResponse(response, txtUserWarning, inpUsername, inpUserControl, icnUsername, 0);
					},
					error: function(err) {
						error[0] = true;
						serverErr(err, inpUsername, inpUserControl);
					}
				});
			}
		}
	});

	$(inpUsername).keyup(function(e) {
		if (e.which !== 9) clearResponse(txtUserWarning, this, icnUsername, 0);
	});

	$(inpEmail).focusout(function() {
		var email = $(this).val(), valid = validateEmail(email);
		let message1 = 'Email Address cannot be empty', message2 = 'Invalid format of email address';
		let proceed = checkInputs(email, this, icnEmail, txtEmailWarning, message1, valid, message2, 1);
		if (proceed) {
			if (!$(inpEmailControl).hasClass('is-loading')) {
				$(inpEmailControl).addClass('is-loading');
				clearResponse(txtEmailWarning, inpEmail, icnEmail, 4);
				$(inpEmail).attr('readonly', true);
				$.ajax({
					type: 'POST',
					url: 'users',
					data: {email:email, data:'email'},
					success: function(response) {
						checkResponse(response, txtEmailWarning, inpEmail, inpEmailControl, icnEmail, 1);
					},
					error: function(err) {
						error[1] = true;
						serverErr(err, inpEmail, inpEmailControl);
					}
				});
			}
		}
	});

	$(inpEmail).keyup(function(e) {
		if (e.which !== 9) clearResponse(txtEmailWarning, this, icnEmail, 1);
	});

	$(btnView).click(function() {
		if( $(inpPassword).attr('type') == 'password' ) {
			$(inpPassword).attr('type', 'text');
			$(icnEye).removeClass('fa-eye').addClass('fa-eye-slash').addClass('has-text-white');
			$(this).removeClass('has-background-grey-lighter').addClass('has-background-grey-dark');
		} else {
			$(inpPassword).attr('type', 'password');
			$(icnEye).removeClass('fa-eye-slash').addClass('fa-eye').removeClass('has-text-white');
			$(this).removeClass('has-background-grey-dark').addClass('has-background-grey-lighter');
		}
	});

	$(inpPassword).focusout(function() {
		var pass = $(this).val(), confirm = $(inpConfirm).val();
		if (pass.length >= 8) {
			if (confirm.trim() != "") {
				validatePassword(pass, confirm);
			} else {
				error[2] = false;
				validate(error);
			}
		} else {
			$(this).removeClass('is-success').addClass('is-danger');
			$(icnPassword).removeClass('has-text-success').addClass('has-text-danger');
			$(txtPassWarning).text('Password must be a minimum length of 8 characters');
			clearResponse(txtConfirmWarning, inpConfirm, inpConfirm, 5);
		}
	});

	$(inpPassword).keyup(function(e) {
		if (e.which !== 9) {
			clearResponse(txtPassWarning, this, icnPassword, 2);
			clearResponse(txtConfirmWarning, inpConfirm, icnConfirm, 2);
		}
	});

	$(inpConfirm).focusout(function() {
		var pass = $(inpPassword).val(), confirm = $(this).val();
		if (pass.length > 8) {
			validatePassword(pass, confirm);
		}
	});

	$(inpConfirm).keyup(function(e) {
		if ($(inpPassword).val() != '' && e.which !== 9) {
			clearResponse(txtPassWarning, inpPassword, icnPassword, 2);
			clearResponse(txtConfirmWarning, this, icnConfirm, 2);
		}
	});
});
